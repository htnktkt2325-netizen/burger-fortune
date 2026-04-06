export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { month, day, burgerName } = req.body;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "anthropic-version": "2023-06-01",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 800,
        system: "あなたはバーガー占い師です。JSONのみで回答し、前後に説明文やコードブロック記号を絶対に付けないでください。",
        messages: [{
          role: "user",
          content: `${month}月${day}日生まれの人を「${burgerName}」バーガーで占い、以下のJSONを返してください。

{"overall":"総合運を一言","love":"恋愛運バーガー比喩1文","work":"仕事運バーガー比喩1文","money":"金運バーガー比喩1文","lucky_topping":"ラッキートッピング名","lucky_color":"ラッキーカラー名","message":"今日のメッセージ2文（最後に有料鑑定への誘導）","score":{"love":4,"work":3,"money":5}}`
        }]
      })
    });

    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({ error: data?.error?.message || "APIエラー" });
    }

    const raw = data?.content?.find(b => b.type === "text")?.text ?? "";
    const jsonStart = raw.indexOf("{");
    const jsonEnd = raw.lastIndexOf("}");
    if (jsonStart === -1 || jsonEnd === -1) {
      return res.status(500).json({ error: "JSON形式で返されませんでした" });
    }

    const parsed = JSON.parse(raw.slice(jsonStart, jsonEnd + 1));
    const clamp = v => Math.min(5, Math.max(1, parseInt(v) || 3));
    parsed.score = {
      love:  clamp(parsed.score?.love),
      work:  clamp(parsed.score?.work),
      money: clamp(parsed.score?.money),
    };

    res.status(200).json(parsed);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
