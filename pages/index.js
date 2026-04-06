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
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}@keyframes pop{0%{transform:scale(0.93);opacity:0}100%{transform:scale(1);opacity:1}}.card{animation:pop 0.3s ease forwards}.btn​​​​​​​​​​​​​​​​
