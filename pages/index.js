import { useState } from "react";
const BURGER_TYPES = [
  { name: "クラシックチーズバーガー", emoji: "🍔" },
  { name: "テリヤキバーガー", emoji: "🍔" },
  { name: "アボカドバーガー", emoji: "🥑" },
  { name: "スパイシーバーガー", emoji: "🌶️" },
  { name: "フィッシュバーガー", emoji: "🐟" },
  { name: "マッシュルームバーガー", emoji: "🍄" },
  { name: "BBQバーガー", emoji: "🔥" },
  { name: "ベジバーガー", emoji: "🥗" },
  { name: "エッグバーガー", emoji: "🍳" },
  { name: "トリュフバーガー", emoji: "✨" },
  { name: "ダブルパティバーガー", emoji: "💪" },
  { name: "和牛バーガー", emoji: "🐄" },
];
function getBurger(birthday) {
  const d = new Date(birthday);
  const idx = ((d.getMonth() + 1) * 3 + d.getDate() * 7) % BURGER_TYPES.length;
  return BURGER_TYPES[idx];
}
function Stars({ count }) {
  const n = Math.min(5, Math.max(1, Number(count) || 3));
  return <span>{[1,2,3,4,5].map(i => <span key={i} style={{color: i<=n?"#FFB800":"#333",fontSize:15}}>★</span>)}</span>;
}
export default function BurgerFortune() {
  const [birthday, setBirthday] = useState("");
  const [fortune, setFortune] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [tab, setTab] = useState("fortune");
  const getFortune = async () => {
    if (!birthday) { setError("誕生日を入力してください"); return; }
    setError(""); setLoading(true); setFortune(null);
    const burger = getBurger(birthday);
    const d = new Date(birthday);
    const m = d.getMonth() + 1;
    const day = d.getDate();
    try {
      const res = await fetch("/api/fortune", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ month: m, day, burgerName: burger.name }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "エラーが発生しました");
      setFortune({ ...data, burger, m, day });
      setTab("fortune");
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };
  const postText = fortune ? `🍔 ${fortune.m}月${fortune.day}日生まれの今日の運勢\n\nあなたのバーガーは「${fortune.burger.name}」${fortune.burger.emoji}\n\n✨ ${fortune.overall}\n\n💕 恋愛：${fortune.love}\n💼 仕事：${fortune.work}\n💰 金運：${fortune.money}\n\n🎯 ラッキートッピング：${fortune.lucky_topping}\n🎨 ラッキーカラー：${fortune.lucky_color}\n\n${fortune.message}\n\n#バーガー占い #誕生日占い #今日の運勢` : "";
  const copy = () => { navigator.clipboard.writeText(postText); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  return (
    <div style={{maxWidth:420,margin:"0 auto",minHeight:"100vh",background:"#110800",fontFamily:"'Hiragino Kaku Gothic Pro','Noto Sans JP',sans-serif",color:"#fff",padding:"14px 13px 32px",boxSizing:"border-box"}}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}@keyframes pop{0%{transform:scale(0.93);opacity:0}100%{transform:scale(1);opacity:1}}.card{animation:pop 0.3s ease forwards}.btn:active{transform:scale(0.97);opacity:0.8}`}</style>
      <div style={{textAlign:"center",marginBottom:14}}>
        <div style={{fontSize:36}}>🍔</div>
        <h1 style={{margin:"2px 0 1px",fontSize:20,fontWeight:"bold",letterSpacing:3,background:"linear-gradient(90deg,#FFB800,#FF6B00)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>バーガー占い</h1>
        <p style={{color:"#553311",fontSize:10,letterSpacing:2,margin:0}}>BURGER FORTUNE</p>
      </div>
      <div style={{background:"rgba(255,184,0,0.05)",border:"1px solid rgba(255,184,0,0.22)",borderRadius:13,padding:"14px",marginBottom:12}}>
        <p style={{color:"#AA7744",fontSize:11,textAlign:"center",margin:"0 0 9px"}}>🔮 誕生日を入力してください</p>
        <input type="date" value={birthday} onChange={e=>{setBirthday(e.target.value);setError("");}} style={{width:"100%",padding:"10px 11px",borderRadius:8,border:"1.5px solid rgba(255,184,0,0.3)",background:"rgba(0,0,0,0.4)",color:"#FFD580",fontSize:14,outline:"none",marginBottom:9,boxSizing:"border-box"}}/>
        {error && <div style={{color:"#FF9090",fontSize:12,marginBottom:8,background:"rgba(255,0,0,0.08)",borderRadius:6,padding:"7px 10px"}}>⚠️ {error}</div>}
        <button className="btn" onClick={getFortune} disabled={loading} style={{width:"100%",padding:"12px",borderRadius:9,border:"none",background:loading?"#222":"linear-gradient(135deg,#FF8C00,#FFB800)",color:loading?"#555":"#1a0a00",fontWeight:"bold",fontSize:14,cursor:loading?"not-allowed":"pointer",letterSpacing:1}}>
          {loading?<><span style={{display:"inline-block",animation:"spin 0.8s linear infinite"}}>🍔</span> 占い中…</>:"🍔  バーガーで占う！"}
        </button>
      </div>
      {fortune && !loading && (
        <div className="card">
          <div style={{display:"flex",marginBottom:10,borderRadius:9,overflow:"hidden",border:"1px solid rgba(255,184,0,0.18)"}}>
            {[["fortune","🔮 運勢"],["post","📋 投稿文"]].map(([k,lbl])=>(
              <button key={k} onClick={()=>setTab(k)} style={{flex:1,padding:"9px 0",border:"none",cursor:"pointer",fontSize:12,fontWeight:"bold",background:tab===k?"rgba(255,184,0,0.18)":"transparent",color:tab===k?"#FFB800":"#555"}}>
                {lbl}
              </button>
            ))}
          </div>
          {tab==="fortune" && (
            <div style={{display:"flex",flexDirection:"column",gap:9}}>
              <div style={{background:"linear-gradient(135deg,rgba(255,184,0,0.1),rgba(255,107,0,0.07))",border:"1px solid rgba(255,184,0,0.25)",borderRadius:11,padding:"12px",textAlign:"center"}}>
                <p style={{margin:"0 0 2px",fontSize:9,color:"#775533",letterSpacing:2}}>あなたのバーガー</p>
                <p style={{margin:"0 0 1px",fontSize:30}}>{fortune.burger.emoji}</p>
                <p style={{margin:"0 0 4px",color:"#FFB800",fontWeight:"bold",fontSize:14}}>{fortune.burger.name}</p>
                <p style={{margin:0,color:"#FF8C00",fontSize:15,fontWeight:"bold"}}>{fortune.overall}</p>
              </div>
              <div style={{background:"rgba(255,255,255,0.025)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:11,padding:"11px 13px",display:"flex",flexDirection:"column",gap:9}}>
                {[["💕 恋愛運",fortune.score.love,fortune.love],["💼 仕事運",fortune.score.work,fortune.work],["💰 金　運",fortune.score.money,fortune.money]].map(([label,score,text])=>(
                  <div key={label}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:2}}>
                      <span style={{color:"#FFD580",fontSize:12,fontWeight:"bold"}}>{label}</span>
                      <Stars count={score}/>
                    </div>
                    <p style={{margin:0,color:"#AAA",fontSize:11,lineHeight:1.65}}>{text}</p>
                  </div>
                ))}
              </div>
              <div style={{background:"rgba(255,255,255,0.025)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:11,padding:"10px 13px",display:"flex",gap:10}}>
                <div style={{flex:1}}><p style={{margin:"0 0 2px",color:"#553311",fontSize:9,letterSpacing:1}}>ラッキートッピング</p><p style={{margin:0,color:"#FFB800",fontSize:12}}>🥒 {fortune.lucky_topping}</p></div>
                <div style={{flex:1}}><p style={{margin:"0 0 2px",color:"#553311",fontSize:9,letterSpacing:1}}>ラッキーカラー</p><p style={{margin:0,color:"#FFB800",fontSize:12}}>🎨 {fortune.lucky_color}</p></div>
              </div>
              <div style={{background:"rgba(255,107,0,0.06)",border:"1px solid rgba(255,107,0,0.18)",borderRadius:11,padding:"11px 13px"}}>
                <p style={{margin:0,color:"#FFD580",fontSize:12,lineHeight:1.85}}>{fortune.message}</p>
              </div>
            </div>
          )}
          {tab==="post" && (
            <div style={{display:"flex",flexDirection:"column",gap:9}}>
              <div style={{background:"rgba(0,0,0,0.3)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:11,padding:"12px 13px"}}>
                <pre style={{margin:0,color:"#CCC",fontSize:11,whiteSpace:"pre-wrap",wordBreak:"break-word",lineHeight:1.75,fontFamily:"inherit"}}>{postText}</pre>
              </div>
              <button className="btn" onClick={copy} style={{padding:"12px",borderRadius:9,border:"1px solid rgba(255,184,0,0.25)",background:copied?"rgba(50,200,100,0.12)":"rgba(255,184,0,0.07)",color:copied?"#50C864":"#FFB800",fontSize:13,cursor:"pointer",fontWeight:"bold"}}>
                {copied?"✅ コピーしました！":"📋 Threads投稿文をコピー"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
