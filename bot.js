const copy = {
  en: {
    hello: "Hi! 👋 Welcome to CoolCare Aircon Services. I can help you request service in under 2 minutes. What do you need?",
    services: [["repair","🔧 Repair / not cold"],["cleaning","🧼 Cleaning / servicing"],["installation","❄️ Installation"],["other","💬 Other enquiry"]],
    units: "How many aircon units need attention?",
    issue: "Briefly describe the issue. You can also send a photo in the real WhatsApp bot.",
    area: "Which area is the property in?",
    property: "What type of property is it?",
    properties: [["home","🏠 House"],["apartment","🏢 Apartment / condo"],["office","🏬 Shop / office"]],
    time: "When would you prefer us to visit?",
    name: "Almost done — what name should we put on the request?",
    confirm: "Please check your request. Reply YES to submit, or RESTART to start again.",
    submitted: "✅ Request received! A team member will contact you with availability and an estimate. This is an enquiry, not a confirmed booking.",
    invalid: "Please choose one of the options below.", yes: "Yes", restart: "Restart"
  },
  zh: {
    hello: "您好！👋 欢迎联系 CoolCare 冷气服务。我可以在两分钟内帮您提交服务询问。请问您需要什么服务？",
    services: [["repair","🔧 维修 / 冷气不冷"],["cleaning","🧼 清洗 / 保养"],["installation","❄️ 安装冷气"],["other","💬 其他询问"]],
    units: "请问有几台冷气需要处理？",
    issue: "请简单说明问题。正式 WhatsApp 版本也可以发送照片。",
    area: "请问房子位于哪个地区？",
    property: "请问是什么类型的房产？",
    properties: [["home","🏠 排屋 / 独立屋"],["apartment","🏢 公寓"],["office","🏬 店面 / 办公室"]],
    time: "您希望我们什么时候上门？",
    name: "快完成了——请问怎么称呼您？",
    confirm: "请检查以下资料。回复“确认”提交，或回复“重新开始”。",
    submitted: "✅ 已收到您的询问！工作人员会联系您确认时间和报价。这还不是正式预约。",
    invalid: "请选择以下其中一个选项。", yes: "确认", restart: "重新开始"
  },
  ms: {
    hello: "Hai! 👋 Selamat datang ke CoolCare Aircon Services. Saya boleh membantu anda membuat permintaan servis dalam masa 2 minit. Apakah yang anda perlukan?",
    services: [["repair","🔧 Baiki / tidak sejuk"],["cleaning","🧼 Cuci / servis"],["installation","❄️ Pemasangan"],["other","💬 Pertanyaan lain"]],
    units: "Berapa unit penyaman udara yang memerlukan perhatian?",
    issue: "Terangkan masalah secara ringkas. Dalam bot WhatsApp sebenar, anda juga boleh menghantar gambar.",
    area: "Hartanah ini terletak di kawasan mana?",
    property: "Apakah jenis hartanah ini?",
    properties: [["home","🏠 Rumah"],["apartment","🏢 Apartmen / kondo"],["office","🏬 Kedai / pejabat"]],
    time: "Bilakah masa pilihan anda untuk lawatan kami?",
    name: "Hampir selesai — apakah nama untuk permintaan ini?",
    confirm: "Sila semak permintaan anda. Balas YA untuk hantar, atau MULA SEMULA.",
    submitted: "✅ Permintaan diterima! Staf kami akan menghubungi anda tentang masa dan anggaran harga. Ini belum menjadi tempahan yang disahkan.",
    invalid: "Sila pilih salah satu pilihan di bawah.", yes: "Ya", restart: "Mula semula"
  }
};

export function newSession(lang = "en") { return { lang, step: "service", data: {} }; }
export function startMessage(lang = "en") { const t=copy[lang]||copy.en; return {text:t.hello, options:t.services}; }
export function receive(session, raw) {
  const t=copy[session.lang]||copy.en, input=String(raw||"").trim();
  if (/^(restart|重新开始|mula semula)$/i.test(input)) return {session:newSession(session.lang), reply:startMessage(session.lang)};
  const s={...session,data:{...session.data}};
  const next=(step,text,options)=>({session:{...s,step},reply:{text,options}});
  if(s.step==="service") { const found=t.services.find(x=>x[0]===input); if(!found)return next("service",t.invalid,t.services); s.data.service=found[1]; return next("units",t.units,[["1","1"],["2","2"],["3","3"],["4+","4+"]]); }
  if(s.step==="units") { s.data.units=input; return next("issue",t.issue); }
  if(s.step==="issue") { s.data.issue=input; return next("area",t.area); }
  if(s.step==="area") { s.data.area=input; return next("property",t.property,t.properties); }
  if(s.step==="property") { const found=t.properties.find(x=>x[0]===input); if(!found)return next("property",t.invalid,t.properties); s.data.property=found[1]; return next("time",t.time,[["today","Today / 今天 / Hari ini"],["tomorrow","Tomorrow / 明天 / Esok"],["weekend","Weekend / 周末 / Hujung minggu"],["other-time","Other / 其他 / Lain-lain"]]); }
  if(s.step==="time") { s.data.time=input; return next("name",t.name); }
  if(s.step==="name") { s.data.name=input; const d=s.data; const summary=`${t.confirm}\n\n👤 ${d.name}\n🛠️ ${d.service}\n❄️ ${d.units} unit(s)\n📝 ${d.issue}\n📍 ${d.area}\n🏠 ${d.property}\n🗓️ ${d.time}`; return next("confirm",summary,[["yes",t.yes],["restart",t.restart]]); }
  if(s.step==="confirm" && input==="yes") return next("done",t.submitted);
  return next(s.step,t.invalid,s.step==="confirm"?[["yes",t.yes],["restart",t.restart]]:undefined);
}
