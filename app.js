const STORAGE_KEY = 'buxumao-state-v1';
const APP_VERSION = 1;

const HOME_COPY_KEY = 'buxumao-home-copy-v1';
const HOME_COPIES = [
  { title: '小肩膀的晴天', section: '今天的小约定' },
  { title: '云朵来串门啦', section: '云朵小清单' },
  { title: '星星坐在肩头', section: '星星小节目' },
  { title: '今天也软乎乎', section: '软软的小计划' },
  { title: '肩头住着小太阳', section: '暖暖的小安排' },
  { title: '把轻松装进口袋', section: '口袋小计划' },
  { title: '快乐来敲门啦', section: '快乐小清单' },
  { title: '小星星陪着你', section: '今日星光清单' },
  { title: '给自己一朵花', section: '花朵小安排' },
  { title: '懒腰故事开场啦', section: '今天的小章节' },
  { title: '和云朵待一会', section: '云边小安排' },
  { title: '留一点软软时光', section: '慢慢的小清单' },
];
let homeCopyIndex = null;
function nextHomeCopy() {
  if (homeCopyIndex === null) {
    try {
      const stored = localStorage.getItem(HOME_COPY_KEY);
      const index = Number(stored);
      if (stored !== null && Number.isInteger(index) && index >= 0 && index < HOME_COPIES.length) homeCopyIndex = index;
    } catch { /* 无法读写存储时，仍可在本次打开期间轮换。 */ }
  }
  homeCopyIndex = homeCopyIndex === null ? Math.floor(Math.random() * HOME_COPIES.length) : (homeCopyIndex + 1) % HOME_COPIES.length;
  try { localStorage.setItem(HOME_COPY_KEY, String(homeCopyIndex)); } catch { /* 文案存储失败不影响训练。 */ }
  return HOME_COPIES[homeCopyIndex];
}

const icon = (name, size = 20) => {
  const paths = {
    home: '<path d="M3 10.7 12 3l9 7.7v8.5a1.8 1.8 0 0 1-1.8 1.8H4.8A1.8 1.8 0 0 1 3 19.2z"/><path d="M8 21v-6.5h8V21"/>',
    book: '<path d="M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3z"/><path d="M5 17h14M8 4v13"/>',
    calendar: '<rect x="3" y="4.5" width="18" height="16" rx="2"/><path d="M7 2.5v4M17 2.5v4M3 9h18"/><path d="M7 13h.01M12 13h.01M17 13h.01M7 17h.01M12 17h.01"/>',
    user: '<circle cx="12" cy="8" r="3.5"/><path d="M4.5 21c.6-4.2 3-6.2 7.5-6.2s6.9 2 7.5 6.2"/>',
    arrow: '<path d="M5 12h13M13 6l6 6-6 6"/>',
    back: '<path d="M19 12H5M11 18l-6-6 6-6"/>',
    close: '<path d="m6 6 12 12M18 6 6 18"/>',
    play: '<path d="m8 5 11 7-11 7z" fill="currentColor" stroke="none"/>',
    pause: '<path d="M8 5v14M16 5v14"/>',
    check: '<path d="m5 12 4.2 4.2L19 6.5"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 10v6M12 7.2v.1"/>',
    settings: '<path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6 17 7M7 17l-1.4 1.4"/><circle cx="12" cy="12" r="4"/>',
    download: '<path d="M12 3v12M7 10l5 5 5-5M5 20h14"/>',
    upload: '<path d="M12 15V3M7 8l5-5 5 5M5 20h14"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    chevronLeft: '<path d="m15 18-6-6 6-6"/>',
    chevronRight: '<path d="m9 18 6-6-6-6"/>',
    edit: '<path d="m4 16.5-.8 4.3 4.3-.8L18.8 8.7a2.1 2.1 0 0 0-3-3zM14 7.5l2.5 2.5"/>',
    shield: '<path d="M12 3 20 6v5.8c0 4.4-3.2 7.7-8 9.2-4.8-1.5-8-4.8-8-9.2V6z"/><path d="m8 12 2.5 2.5L16 9"/>',
    spark: '<path d="m12 2 1.6 7 6.4 3-6.4 3-1.6 7-1.6-7-6.4-3 6.4-3z"/>',
    bell: '<path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/>',
    moon: '<path d="M20 15.5A8.5 8.5 0 0 1 8.5 4 8.5 8.5 0 1 0 20 15.5z"/>',
  };
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.info}</svg>`;
};

const escapeHtml = (value) => String(value ?? '').replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));
const pad = (value) => String(value).padStart(2, '0');
const dateKey = (date = new Date()) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
const formatDate = (date = new Date()) => `${date.getMonth() + 1}月${date.getDate()}日 · ${['日', '一', '二', '三', '四', '五', '六'][date.getDay()]}`;
const formatTime = (ms) => `${Math.floor(Math.max(0, ms) / 60000)}′${pad(Math.floor(Math.max(0, ms) / 1000) % 60)}″`;
const formatClock = (ms) => `${Math.ceil(Math.max(0, ms) / 1000)}`;
const clone = (value) => JSON.parse(JSON.stringify(value));
const uid = (prefix = 'id') => `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;

const actionsSeed = [
  {
    id: 'wall-protraction', name: '墙面肩胛前伸练习', category: '徒手', equipment: '无器械', mode: 'reps', sets: 3, reps: 15, holdSeconds: 0, tempo: 4, rest: 45,
    prep: '站在墙前，前臂轻贴墙面，保持颈部放松。', steps: ['双手前臂贴墙，肩膀保持自然。', '缓慢向前推开肩胛，再回到起始位置。', '动作幅度以舒适、可控为准。'], breath: '推出时呼气，回位时吸气。', errors: ['耸肩顶颈', '为了幅度强行夹背'], caution: '如出现疼痛、明显无力或麻木，请停止并咨询专业人员。', color: 'blue'
  },
  {
    id: 'prone-y', name: '俯身 Y 字上举', category: '徒手', equipment: '无器械', mode: 'reps', sets: 3, reps: 12, holdSeconds: 0, tempo: 4, rest: 45,
    prep: '俯身或趴卧，双臂向前展开成 Y 字。', steps: ['让肩胛骨自然贴向胸廓。', '小幅抬起双臂，停留后缓慢放下。', '保持下背部舒适，不追求高度。'], breath: '抬起时呼气，放下时吸气。', errors: ['用腰部代偿', '头部过度抬起'], caution: '默认参数仅为演示，可按感受调整。', color: 'yellow'
  },
  {
    id: 'scapular-retraction', name: '肩胛后缩控制练习', category: '徒手', equipment: '无器械', mode: 'reps', sets: 3, reps: 15, holdSeconds: 0, tempo: 4, rest: 45,
    prep: '坐姿或站姿，双臂自然下垂。', steps: ['想象肩胛骨向后下方滑动。', '停留一拍，再回到放松位置。', '不需要把肩膀强行压低。'], breath: '保持均匀呼吸，不屏息。', errors: ['全程夹紧不放松', '肩膀耸起'], caution: '以“可重复、可放松”为目标，不追求极限幅度。', color: 'sage'
  },
  {
    id: 'lat-pulldown', name: '高位下拉（可选器械）', category: '健身房器械', equipment: '高位下拉器械', mode: 'reps', sets: 3, reps: 12, holdSeconds: 0, tempo: 4, rest: 60,
    prep: '调整座椅与重量，握距和握法按舒适与专业建议设置。', steps: ['保持躯干稳定，先让肩胛骨向下旋转。', '将把手拉至舒适位置，再控制回程。', '避免为了重量牵拉颈部或耸肩。'], breath: '下拉时呼气，回程时吸气。', errors: ['身体大幅后仰', '为了重量快速甩动'], caution: '仅在拥有器械并熟悉安全设置时使用。', color: 'pink'
  },
  {
    id: 'band-external-rotation', name: '弹力带肩外旋', category: '弹力带', equipment: '弹力带', mode: 'reps', sets: 3, reps: 15, holdSeconds: 0, tempo: 4, rest: 45,
    prep: '肘部贴近身体，弹力带保持轻微张力。', steps: ['保持肘部位置稳定。', '前臂向外打开至舒适范围。', '缓慢回到起始位置。'], breath: '打开时呼气，回位时吸气。', errors: ['肘部离开身体', '快速弹回'], caution: '本动作不是胸小肌拉伸，请按肩关节舒适度控制。', color: 'yellow'
  },
  {
    id: 'wall-posture', name: '靠墙肩胛姿态控制', category: '徒手', equipment: '无器械', mode: 'hold', sets: 3, reps: 0, holdSeconds: 30, tempo: 1, rest: 30,
    prep: '背部靠墙，找到自然、可呼吸的站姿。', steps: ['让后脑勺、背部或骨盆在舒适范围内靠墙。', '保持肩胛骨放松、胸廓可呼吸。', '以持续稳定为目标，而不是强行贴平。'], breath: '保持自然呼吸，感受肋骨扩张。', errors: ['憋气', '强行收腹或沉肩'], caution: '靠墙只是参考，不必追求所有部位都贴紧。', color: 'blue'
  },
];

const extraActions = [
  { id: 'shoulder-raise', name: '站姿肩胛平面抬臂', category: '徒手', equipment: '无器械', bodyPart: '肩部', mode: 'reps', sets: 2, reps: 10, holdSeconds: 0, tempo: 4, rest: 45, color: 'yellow', purpose: '练习肩部在舒适范围内抬臂与缓慢回落的控制。', prep: '自然站立，双脚与髋同宽，双手垂在身体两侧，拇指朝前或稍朝外。', steps: ['双臂在身体前侧略向外的方向缓慢抬起，手肘保持自然微屈。', '抬至肩部舒适的位置即可，无需追求高度；避免耸肩或后仰。', '缓慢放回身体两侧，再自然放松后重复。'], breath: '抬起时呼气，放下时吸气，保持自然呼吸。', errors: ['耸肩或仰腰借力：减小幅度，放慢速度。', '动作过快或手臂僵直：放松手肘并控制回程。'], scope: '适合可舒适抬臂者，可先做徒手小幅练习。', caution: '若出现疼痛、麻木或明显无力，请停止并咨询专业人员。' },
  { id: 'shoulder-rotation', name: '站姿肩外旋控制', category: '徒手', equipment: '无器械', bodyPart: '肩部', mode: 'reps', sets: 2, reps: 10, holdSeconds: 0, tempo: 4, rest: 45, color: 'blue', purpose: '在没有额外阻力的情况下，练习肩部外旋的方向与控制。', prep: '坐姿或站姿，双肘自然靠近身体并弯曲约 90 度，掌心相对。', steps: ['保持上臂轻靠身体，手腕自然平直。', '缓缓将前臂向外打开，只转到肩部舒适的范围。', '慢慢回到起始位置，不用甩动或转身借力。'], breath: '打开时呼气，回位时吸气。', errors: ['肘部大幅离开身体：缩小动作幅度。', '转动躯干借力：让身体保持相对安静。'], scope: '适合希望先熟悉动作的初学者；没有弹力带也能练习。', caution: '出现肩部疼痛或不适时停止；近期损伤请先咨询专业人员。' },
  { id: 'glute-bridge', name: '臀桥', category: '徒手', equipment: '无器械', bodyPart: '臀腿', mode: 'reps', sets: 2, reps: 12, holdSeconds: 0, tempo: 4, rest: 45, color: 'sage', purpose: '练习髋部抬起与缓慢落下的控制。', prep: '仰卧在稳定的垫面上，屈膝，双脚与髋同宽踩稳，双臂自然放在身体两侧。', steps: ['轻轻呼气，双脚均匀踩地，缓慢抬起骨盆到舒适位置。', '在顶部短暂停留，保持肋骨自然，不要过度拱腰。', '缓慢放下骨盆，回到垫面后放松，再进行下一次。'], breath: '抬起时呼气，落下时吸气。', errors: ['为了抬高而过度拱腰：降低高度，控制动作。', '膝盖向内明显晃动：双脚踩稳，动作放慢。'], scope: '适合能舒适仰卧及屈膝的人；可从小幅度开始。', caution: '腰背、髋部或膝部疼痛时停止，并咨询专业人员。' },
  { id: 'chair-squat', name: '坐站练习', category: '徒手', equipment: '无器械', bodyPart: '臀腿', mode: 'reps', sets: 2, reps: 10, holdSeconds: 0, tempo: 4, rest: 45, color: 'pink', purpose: '练习从椅子坐下与站起时的腿部和髋部控制。', prep: '准备不会滑动的稳固椅子，坐在椅面前半部，双脚踩稳并与髋同宽。', steps: ['身体微微前倾，脚掌均匀发力，缓慢站起来。', '站稳后让髋部向后移动，慢慢弯曲膝盖，控制身体坐回椅面。', '需要时可以扶住稳固桌面或椅子扶手，按照自己的节奏重复。'], breath: '站起时呼气，坐下时吸气，避免憋气。', errors: ['快速跌坐：减慢下坐速度并使用扶手。', '膝盖明显内扣或脚跟抬起：缩小幅度、保持脚掌踩稳。'], scope: '适合能在有或没有扶手帮助下安全坐站的人。', caution: '如有疼痛、头晕或无法保持平衡，请停止并咨询专业人员。' }
];
actionsSeed.push(...extraActions);

// 教学文案独立于用户编辑的训练参数和历史计划快照，更新后旧用户也能看到。
const tutorialGuides = {
  'wall-protraction': {
    purpose: '练习手臂支撑时肩胛骨随胸廓轻柔滑动的感觉。先熟悉小幅度动作，再按舒适程度调整。',
    prep: '面向稳固的墙站立，双脚与髋同宽，距离墙面约半步。双手掌心贴墙，大致与肩同高、同宽；手肘自然伸直但不要锁死，膝盖微松，头颈保持自然。',
    steps: ['轻轻把双手推向墙面，让上背部稍微变圆，感受肩胛骨沿胸廓向两侧滑动；身体不要明显前后晃动。', '在舒适的尽头短暂停一下，肩膀和脖子仍保持放松，不需要刻意耸肩。', '缓慢减小推墙的力量，让肩胛骨自然回到起始位置；回程不必用力夹紧肩胛骨。', '重复时保持手掌稳定贴墙，以能平稳呼吸、动作可控为准。'],
    breath: '向墙轻推时慢慢呼气；回到起始位置时吸气。演示节奏为一次约 4 秒，可理解为推出约 2 秒、回位约 2 秒；呼吸不必刻意憋住。',
    errors: ['耸肩或脖子紧绷：缩小推墙幅度，放慢速度，让肩膀回到自然位置。', '用腰部前顶、身体摇晃代替肩胛运动：脚下站稳，让躯干保持相对安静。', '回程时用力夹背：只回到舒适的起始位置，避免追求极限幅度。'],
    scope: '适合希望尝试温和墙面支撑练习的人；站得离墙更近、减小动作幅度可让练习更容易控制。',
    caution: '如果手腕或肩部不适，可以停止并向专业人员询问适合自己的姿势。出现疼痛、麻木或明显无力时停止训练。'
  },
  'prone-y': {
    purpose: '练习俯卧时小幅抬臂的控制，感受肩部与肩胛随手臂自然配合。',
    prep: '找一张稳固的垫子俯卧，额头可垫折叠毛巾，视线向下。双臂向头顶前方斜伸成宽松的 Y 字，拇指朝上；双腿自然放松。',
    steps: ['先让肩膀放松，腹部轻轻接触垫面，保持自然呼吸。', '缓慢抬起双手和手臂，只抬到肩膀、颈部与腰背都舒适的位置；不需要举高。', '在顶点短暂停顿，留意双侧是否能平稳控制，不要硬把肩胛骨夹在一起。', '慢慢把手臂放回垫面，放松后再做下一次；如果不方便俯卧，可在专业人员指导下选择适合的姿势。'],
    breath: '抬臂时轻轻呼气，放下时吸气。演示为每次约 4 秒；可以放慢节奏，以能保持动作稳定为准。',
    errors: ['抬头看前方或耸肩：让额头有支撑、视线向下，并缩小手臂抬起高度。', '挺腰或憋气借力：轻放肋骨，保持呼吸，必要时减少次数。', '追求手抬得很高：改为小幅、平稳的动作，避免甩动。'],
    scope: '适合能够舒适俯卧、抬臂不引起不适的人；没有空间或不适合俯卧时可以暂时跳过。',
    caution: '如有近期肩部、颈部或腰背损伤，先咨询专业人员。出现疼痛、麻木或明显无力时停止。'
  },
  'scapular-retraction': {
    purpose: '练习感受肩胛骨轻柔向后滑动和自然放松之间的区别。',
    prep: '坐在稳固的椅子上或自然站立，双脚踩稳，双臂自然垂在身体两侧。头颈保持舒适，肋骨不必刻意上挺。',
    steps: ['先呼吸一次，注意肩膀自然放松的位置。', '轻柔地让两侧肩胛骨向背部中间靠近一点，像把肩膀稍稍向后带；幅度以舒适为准。', '短暂停留，再缓慢放松，让肩胛骨回到自然位置。', '每次都允许肩膀完全放松后再继续，不必持续用力夹背或强行沉肩。'],
    breath: '轻柔后移时呼气，放松回位时吸气。示例为每次约 4 秒；保持说话不费力的呼吸节奏。',
    errors: ['全程用力夹背：减轻力量，每次回位后先放松。', '耸肩、挺胸或腰部后仰：让颈部放松，减小动作幅度。', '把肩膀强行压低：肩胛自然活动即可，无须固定在某个位置。'],
    scope: '可在居家或办公室坐姿、站姿尝试；适合作为短时间的动作感知练习。',
    caution: '如果向后移动让肩部或颈部疼痛，不要勉强；必要时请专业人员评估适合的动作。'
  },
  'lat-pulldown': {
    purpose: '使用高位下拉器械练习控制下拉与回程。器械动作需要根据设备说明、安全设置和个人情况调整。',
    prep: '检查插销、把手与坐垫是否固定，从较轻的重量开始。坐稳并将双脚踩实；根据器械和个人舒适度选择握距与握法，手腕尽量保持自然。',
    steps: ['先坐稳，双手握住把手，手臂向上伸展到舒适范围，避免身体被重量猛然拉起。', '呼气时屈肘，让手肘向身体两侧下方移动，把手向上胸方向拉至舒适位置；保持动作平稳。', '躯干保持相对稳定，避免大幅后仰或借身体摆动拉动重量。', '吸气时缓慢让手臂向上伸展，让配重受控回升；不要突然松手或让配重猛烈碰撞。'],
    breath: '下拉时呼气，回程时吸气；示例每次约 4 秒。重量应允许你顺畅呼吸并控制回程。',
    errors: ['重量过大、靠甩动或大幅后仰完成：降低重量，缩小幅度。', '下拉到颈后或把手拉得过低：以身体前方、舒适且可控的范围练习。', '全程强行沉肩或夹背：让肩胛随手臂自然运动。'],
    scope: '仅适用于有高位下拉器械且了解设备使用方法的用户；握法、握距和负重可参考专业人员建议。',
    caution: '首次使用或不确定调节方法时，请向教练或专业人员确认；如果出现疼痛、麻木或明显无力，停止练习。'
  },
  'band-external-rotation': {
    purpose: '练习肘部靠近身体时的肩关节外旋控制；这是肩外旋练习，不是胸小肌拉伸。',
    prep: '将弹力带牢固固定在身体一侧、约肘部高度；站在稳固位置，用远离固定点的手握住弹力带。肘部弯曲约 90 度并自然靠近身体，手腕保持平直。',
    steps: ['先检查弹力带和固定点，选择轻阻力，站到弹力带稍有张力的位置。', '保持上臂靠近身体，缓慢让前臂向身体外侧转动；肘部可轻贴折叠毛巾，但不要夹得过紧。', '转到肩部舒适的位置即可，躯干朝前，不用转身借力。', '控制弹力带慢慢回到起始位置，避免弹回；单侧完成后可在舒适范围内练习另一侧。'],
    breath: '前臂向外转时呼气，慢慢回位时吸气。示例每次约 4 秒；阻力过大时可换更轻的弹力带或缩小幅度。',
    errors: ['肘部明显离开身体或转动躯干：减少阻力，缓慢完成小幅动作。', '手腕弯折或用力握紧：保持手腕自然平直，轻握即可。', '回程突然弹回：放慢速度，必要时降低阻力。'],
    scope: '适合有完好弹力带及稳固固定点、外旋动作不引起不适的人。',
    caution: '训练前检查弹力带是否破损、固定是否可靠；如有肩部疼痛或近期损伤，先咨询专业人员。'
  },
  'wall-posture': {
    purpose: '借助墙面感受放松站姿与自然呼吸，练习在舒适姿势中短暂保持。',
    prep: '背对平稳墙面站立，双脚与髋同宽，可以稍稍离墙。让身体轻靠墙面，膝盖放松，双臂自然垂下。',
    steps: ['先找到能轻松呼吸的位置，后背或骨盆自然接触墙面；不同人的接触范围可以不同。', '头颈保持舒适，眼睛平视；后脑勺能轻靠墙时再靠，不需要向后顶。', '让肩膀自然放松，留意胸廓随呼吸轻微起伏，不必把肩胛骨或腰部强压到墙上。', '在舒适范围内保持设定时间；如觉得疲劳或不舒服，可提前结束、休息后再决定是否继续。'],
    breath: '保持自然、均匀的吸气与呼气，想象肋骨随呼吸轻轻扩张和回落。演示保持 30 秒，可依感受缩短。',
    errors: ['憋气或为了贴墙过度收腹：放松肋骨，恢复自然呼吸。', '强行压平腰背或把肩膀压低：允许身体保留自然曲线和舒适间隙。', '站姿僵硬、膝盖锁死：双脚站稳，膝盖保持微松。'],
    scope: '适合能够舒适站立并靠墙的人；站立不便时可咨询专业人员选择坐姿练习。',
    caution: '墙面只是感受姿势的参考，不要求所有身体部位贴墙；出现疼痛、头晕、麻木或明显无力时停止。'
  }
};

// 只链接到第三方原站，不复制或托管视频。动作名称、媒体来源、授权状态及审核状态留在动作数据中。
const tutorialMedia = {
  'wall-protraction': { url: 'https://us.physitrack.com/home-exercise-video/scapula-push-up---wall-push-up-plus', title: 'Scapula push up - Wall push up plus', provider: 'Physitrack', licenseStatus: '仅跳转原站，未复制或托管', reviewStatus: '未由本应用康复专业人员审核' },
  'prone-y': { url: 'https://www.youtube.com/watch?v=rC-0I9IP9Qk', title: 'Exercise 05 Prone Ys', provider: 'Houston Methodist', licenseStatus: '仅跳转原站，未复制或托管', reviewStatus: '未由本应用康复专业人员审核' },
  'scapular-retraction': { url: 'https://us.physitrack.com/home-exercise-video/standing-scapula-setting', title: 'Standing Scapula Setting', provider: 'Physitrack', licenseStatus: '仅跳转原站，未复制或托管', reviewStatus: '未由本应用康复专业人员审核' },
  'lat-pulldown': { url: 'https://www.qmsu.org/qmotion/guides/video/21286/Lat-Pulldown/', title: 'Lat Pulldown', provider: 'QMotion Video Guide', licenseStatus: '仅跳转原站，未复制或托管', reviewStatus: '未由本应用康复专业人员审核' },
  'band-external-rotation': { url: 'https://us.physitrack.com/home-exercise-video/resisted-shoulder-external-rotation-in-standing---version-2', title: 'Resisted shoulder external rotation in standing', provider: 'Physitrack', licenseStatus: '仅跳转原站，未复制或托管', reviewStatus: '未由本应用康复专业人员审核' },
  'wall-posture': { url: 'https://us.physitrack.com/home-exercise-video/posture-standing-against-a-wall', title: 'Posture standing against a wall', provider: 'Physitrack', licenseStatus: '仅跳转原站，未复制或托管', reviewStatus: '未由本应用康复专业人员审核', note: '原视频有贴墙姿势提示；本应用建议自然呼吸、不要强行压平肩胛或腰背，以本页文字为准。' },
  'shoulder-raise': { url: 'https://www.csp.org.uk/conditions/shoulder-pain/video-exercises-shoulder-pain', title: 'Scaption strengthening', provider: 'Chartered Society of Physiotherapy', licenseStatus: '仅跳转原站，未复制或托管', reviewStatus: '未由本应用康复专业人员审核', note: '原视频示范带重量；本动作默认徒手练习，按本页的舒适范围控制。' },
  'shoulder-rotation': { url: 'https://www.youtube.com/watch?v=S-rKHLukxIQ', title: 'Shoulder AROM exercises · external rotation', provider: 'DeMaine Chiropractic and Rehab Centers', licenseStatus: '仅跳转原站，未复制或托管', reviewStatus: '未由本应用康复专业人员审核' },
  'glute-bridge': { url: 'https://www.youtube.com/watch?v=2D_wBEocHF0', title: 'Supine bridges', provider: 'Houston Methodist', licenseStatus: '仅跳转原站，未复制或托管', reviewStatus: '未由本应用康复专业人员审核' },
  'chair-squat': { url: 'https://us.physitrack.com/home-exercise-video/sit-to-stand---version-1', title: 'Sit to stand', provider: 'Physitrack', licenseStatus: '仅跳转原站，未复制或托管', reviewStatus: '未由本应用康复专业人员审核' },
};

for (const action of [...actionsSeed, ...extraActions]) {
  action.tutorial = clone(tutorialMedia[action.id]);
}

const makeDefaultState = () => ({
  schemaVersion: APP_VERSION,
  preferences: null,
  actions: clone(actionsSeed),
  activePlan: { id: '7', name: '7天训练体验计划', startDate: dateKey(), paused: false },
  planSnapshot: null,
  sessions: [],
  manualRecords: [],
  restDays: [],
  dailyRecords: {},
  activeSession: null,
  settings: { prepSeconds: 5, transitionSeconds: 15, sound: true, vibration: true },
  reminder: { enabled: false, time: '19:30', permission: 'default' },
});

let state = loadState();
let ui = { screen: state.preferences ? 'main' : 'onboarding', tab: 'home', modal: null, onboardingStep: 0, onboardingDraft: clone(state.preferences || { scene: '居家', equipment: '无器械', experience: '初次训练', minutes: 15, reminder: false, professionalAdvice: false }), filter: '全部', query: '', calendarDate: new Date(), selectedDate: dateKey(), summary: null, toast: '', homeCopy: nextHomeCopy() };
let tickHandle = null;

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return makeDefaultState();
    const parsed = JSON.parse(raw);
    const base = makeDefaultState();
    const merged = { ...base, ...parsed, settings: { ...base.settings, ...(parsed.settings || {}) }, reminder: { ...base.reminder, ...(parsed.reminder || {}) } };
    merged.actions = Array.isArray(parsed.actions) && parsed.actions.length ? parsed.actions : clone(actionsSeed);
    if (merged.activeSession) {
      merged.activeSession.isPaused = true;
      merged.activeSession.pausedAt = merged.activeSession.pausedAt || merged.activeSession.lastSavedAt || Date.now();
      merged.activeSession.restoredAt = Date.now();
    }
    return migrateState(merged);
  } catch (error) {
    console.warn('Failed to load local data', error);
    return makeDefaultState();
  }
}

function migrateState(input) {
  const next = { ...makeDefaultState(), ...input };
  next.actions = Array.isArray(input.actions) ? input.actions : clone(actionsSeed);
  for (const action of extraActions) if (!next.actions.some((item) => item.id === action.id)) next.actions.push(clone(action));
  next.actions = next.actions.map((action) => tutorialMedia[action.id] ? { ...action, tutorial: { ...tutorialMedia[action.id], ...(action.tutorial || {}) } } : action);
  next.schemaVersion = APP_VERSION;
  next.sessions = Array.isArray(input.sessions) ? input.sessions : [];
  next.manualRecords = Array.isArray(input.manualRecords) ? input.manualRecords : [];
  next.restDays = Array.isArray(input.restDays) ? input.restDays : [];
  next.dailyRecords = input.dailyRecords || {};
  return next;
}

function persist() {
  if (state.activeSession && !state.activeSession.isPaused) state.activeSession.lastSavedAt = Date.now();
  state.dailyRecords = buildDailyRecords();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function getAction(id) { return state.actions.find((action) => action.id === id); }
function renderVideoLink(action, placement = 'detail') {
  const media = action?.tutorial || tutorialMedia[action?.id];
  if (!media?.url) return '';
  let parsedUrl;
  try { parsedUrl = new URL(media.url); } catch { return ''; }
  if (parsedUrl.protocol !== 'https:' && parsedUrl.protocol !== 'http:') return '';
  const safeUrl = escapeHtml(parsedUrl.href);
  if (placement === 'card') return `<a class="video-action-link" href="${safeUrl}" target="_blank" rel="noopener noreferrer" aria-label="打开${escapeHtml(action.name)}真人视频教学">${icon('play', 14)}<span>真人视频</span></a>`;
  if (placement === 'player') return `<a class="player-video-link" href="${safeUrl}" target="_blank" rel="noopener noreferrer">${icon('play', 15)} 查看真人动作视频教学 <span>站外打开 ↗</span></a>`;
  const languageHint = media.language || (media.provider === '哔哩哔哩 · 康复运动' ? '中文' : '英语页面');
  return `<section class="info-block video-tutorial-block"><h3>真人动作视频教学</h3><p class="video-source">${escapeHtml(media.title)} · 来源：${escapeHtml(media.provider)} · ${escapeHtml(languageHint)}</p>${media.note ? `<p class="video-note">${escapeHtml(media.note)}</p>` : ''}<a class="video-detail-link" href="${safeUrl}" target="_blank" rel="noopener noreferrer">${icon('play', 16)} 打开此动作视频教学 ↗</a><p class="video-disclosure">跳转至第三方原站，不在本应用内播放或托管。${escapeHtml(media.reviewStatus || '未由本应用康复专业人员审核')}。</p></section>`;
}
function availableActions() {
  const equipment = ui.onboardingDraft.equipment || state.preferences?.equipment || '无器械';
  return state.actions.filter((action) => {
    if (action.id === 'lat-pulldown') return equipment === '高位下拉器械';
    if (action.equipment === '弹力带') return equipment === '弹力带' || equipment === '高位下拉器械';
    return true;
  });
}
function createPlanSnapshot() {
  const equipment = state.preferences?.equipment || '无器械';
  const preferred = state.actions.filter((action) => {
    if (action.id === 'lat-pulldown') return equipment === '高位下拉器械';
    if (action.equipment === '弹力带') return equipment === '弹力带' || equipment === '高位下拉器械';
    return true;
  });
  const ordered = preferred.filter((action) => ['wall-protraction', 'prone-y', 'scapular-retraction', 'lat-pulldown', 'band-external-rotation', 'wall-posture'].includes(action.id));
  return { createdAt: Date.now(), preferenceSnapshot: clone(state.preferences), actions: ordered.map((action) => clone(action)) };
}
function planDay() {
  if (!state.activePlan?.startDate) return 1;
  const start = new Date(`${state.activePlan.startDate}T00:00:00`);
  const now = new Date(`${dateKey()}T00:00:00`);
  return Math.max(1, Math.min(state.activePlan.id === '30' ? 30 : 7, Math.floor((now - start) / 86400000) + 1));
}
function planLength() { return state.activePlan?.id === '30' ? 30 : 7; }
function planDayType(day) {
  if (state.activePlan?.id === '30') return day % 7 === 0 ? { label: '休息日', kind: 'rest' } : day % 3 === 0 ? { label: '轻量活动', kind: 'light' } : { label: '训练日', kind: 'train' };
  return day === 4 ? { label: '轻量活动', kind: 'light' } : day === 7 ? { label: '休息日', kind: 'rest' } : { label: '训练日', kind: 'train' };
}
function ensurePlanSnapshot() {
  if (!state.planSnapshot || !state.planSnapshot.actions?.length) { state.planSnapshot = createPlanSnapshot(); persist(); }
  return state.planSnapshot;
}
function totalSets(snapshot = ensurePlanSnapshot()) { return snapshot.actions.reduce((sum, action) => sum + action.sets, 0); }
function actionDuration(action) { return action.mode === 'hold' ? action.holdSeconds : action.reps * action.tempo; }
function plannedSeconds(snapshot = ensurePlanSnapshot()) {
  return snapshot.actions.reduce((sum, action, index) => sum + action.sets * actionDuration(action) + Math.max(0, action.sets - 1) * action.rest + (index < snapshot.actions.length - 1 ? state.settings.transitionSeconds : 0), state.settings.prepSeconds);
}
function activeSessionProgress(session = state.activeSession) {
  if (!session) return { completed: 0, total: 0, skipped: 0, ratio: 0 };
  const completed = session.sets.filter((set) => set.status === 'completed').length;
  const skipped = session.sets.filter((set) => set.status === 'skipped').length;
  const total = session.sets.length;
  return { completed, skipped, total, ratio: total ? completed / total : 0 };
}
function sessionEffectiveMs(session) { return (session?.sets || []).reduce((sum, set) => sum + (set.status === 'completed' ? (set.actualWorkMs || 0) : 0), 0); }
function sessionRestMs(session) { return (session?.sets || []).reduce((sum, set) => sum + (set.restMs || 0), 0); }

function buildDailyRecords() {
  const records = {};
  for (const session of state.sessions) {
    if (!session.startedDateKey) continue;
    const progress = activeSessionProgress(session);
    if (progress.completed > 0) {
      const old = records[session.startedDateKey] || { date: session.startedDateKey, completedSets: 0, totalSets: progress.total, effectiveMs: 0, restMs: 0, sessions: 0, status: 'partial' };
      old.completedSets += progress.completed;
      old.totalSets = Math.max(old.totalSets, progress.total);
      old.effectiveMs += sessionEffectiveMs(session);
      old.restMs += sessionRestMs(session);
      old.sessions += 1;
      old.status = old.completedSets >= old.totalSets ? 'complete' : 'partial';
      records[session.startedDateKey] = old;
    }
  }
  for (const manual of state.manualRecords) {
    const old = records[manual.date] || { date: manual.date, completedSets: 0, totalSets: 0, effectiveMs: 0, restMs: 0, sessions: 0, status: 'partial' };
    old.effectiveMs += (manual.minutes || 0) * 60000;
    old.sessions += 1;
    old.manual = true;
    old.status = old.status === 'complete' ? old.status : 'partial';
    records[manual.date] = old;
  }
  for (const rest of state.restDays) records[rest] = { date: rest, status: 'rest', completedSets: 0, totalSets: 0, effectiveMs: 0, restMs: 0, sessions: 0 };
  return records;
}
function validTrainingDate(key) { const record = state.dailyRecords[key]; return record && (record.status === 'complete' || record.status === 'partial') && record.effectiveMs > 0; }
function calculateStreak() {
  let cursor = new Date(`${dateKey()}T00:00:00`);
  if (!validTrainingDate(dateKey(cursor))) cursor.setDate(cursor.getDate() - 1);
  let count = 0;
  while (validTrainingDate(dateKey(cursor))) { count += 1; cursor.setDate(cursor.getDate() - 1); }
  return count;
}
function calculateStats() {
  const records = state.dailyRecords;
  const days = Object.values(records).filter((record) => record.status === 'complete' || record.status === 'partial');
  const sevenAgo = new Date(); sevenAgo.setDate(sevenAgo.getDate() - 6);
  const thirtyAgo = new Date(); thirtyAgo.setDate(thirtyAgo.getDate() - 29);
  return { days: days.length, streak: calculateStreak(), effectiveMs: days.reduce((sum, record) => sum + record.effectiveMs, 0), last7: days.filter((record) => new Date(`${record.date}T23:59:59`) >= sevenAgo).length, last30: days.filter((record) => new Date(`${record.date}T23:59:59`) >= thirtyAgo).length };
}

function doodleIcon(name, size = 22) {
  const shapes = {
    spark: '<path d="m12 2 1.7 6.5L20 12l-6.3 3.5L12 22l-1.7-6.5L4 12l6.3-3.5z"/><path d="M4 4.5v3M2.5 6h3M19.5 17v2M18.5 18h2"/>',
    cloud: '<path d="M5.5 17.5h12.8a3.7 3.7 0 0 0 .3-7.4 5.8 5.8 0 0 0-10.9-1.4A4.5 4.5 0 0 0 5.5 17.5Z"/><path d="M7 20.5h.01M12 20.5h.01M17 20.5h.01"/>',
    sprout: '<path d="M12 21V10"/><path d="M12 12C7 12 4 9.8 4 5c4.7-.2 8 1.4 8 7Z"/><path d="M12 16c5 0 8-2.2 8-7-4.7-.2-8 1.4-8 7Z"/>',
    book: '<path d="M4.5 5.5c2.5-1.5 5-.9 7.5.6v13c-2.5-1.5-5-2.1-7.5-.6zM19.5 5.5c-2.5-1.5-5-.9-7.5.6v13c2.5-1.5 5-2.1 7.5-.6z"/><path d="m18 3 .7 2 1.8.6-1.8.6-.7 2-.7-2-1.8-.6 1.8-.6z"/>',
    calendar: '<rect x="4" y="5.5" width="16" height="15" rx="3"/><path d="M8 3.5v4M16 3.5v4M4 10h16"/><path d="m8 15 1.7 1.7L13 13.4"/><path d="M15.5 14.5h.01"/>',
    records: '<path d="M6 4.5h12v16H6z"/><path d="M9 3h6v3H9zM9 10h6M9 14h6M9 18h3"/><path d="m16 16 1.2 1.2 2.3-2.7"/>',
    home: '<path d="m4 10 8-6 8 6v9.5a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 19.5z"/><path d="M9 21v-6h6v6M7.5 10.5h.01M16.5 10.5h.01"/>',
    user: '<path d="M5 20c.7-4.1 3-6.2 7-6.2s6.3 2.1 7 6.2"/><path d="M8 8.3c0-2.5 1.8-4.3 4-4.3s4 1.8 4 4.3c0 2.2-1.8 3.7-4 3.7s-4-1.5-4-3.7Z"/><path d="M6 5.5 4.5 4M18 5.5 19.5 4"/>',
    heart: '<path d="M12 20S4.5 15.5 4.5 9.7A4 4 0 0 1 12 7.4a4 4 0 0 1 7.5 2.3C19.5 15.5 12 20 12 20Z"/><path d="M7.5 4.5v2M6.5 5.5h2"/>',
    bell: '<path d="M18 10a6 6 0 0 0-12 0c0 6-2.2 7.2-2.2 8.2h16.4C20.2 17.2 18 16 18 10Z"/><path d="M10 21h4M19.5 5.5l1-1M4.5 5.5l-1-1"/>',
    cup: '<path d="M6 8h10v7a5 5 0 0 1-10 0zM16 10h1.6a2.4 2.4 0 0 1 0 4.8H16"/><path d="M8 4c1-1.3 2 1 3 0s2-1.3 3 0M7 20h10"/>',
    muscle: '<path d="M6 14c-1.5-2.4.4-5.8 3-5.8h2l1-2.2 2.1 1.4-.6 2.1 2.3 1.1c2.6 1.2 3.2 4.5 1.3 6.5-1.5 1.6-4.3 1.9-6.2.7L8.5 17H6.8c-1.4 0-2.2-1.6-.8-3Z"/><path d="M3.5 13.5h4M2.5 16h5M17.5 9.5l1.7-1.7"/>',
    flag: '<path d="M6 21V4"/><path d="M6 5c3-2 5 2 8 0s4 0 4 0v8s-2-2-4 0-5-2-8 0"/>',
    cat: '<path d="m5 9 1-4 3 2a8 8 0 0 1 6 0l3-2 1 4v5.1c0 3.1-3.1 5.4-7 5.4s-7-2.3-7-5.4Z"/><path d="M9 13h.01M15 13h.01M10 16c1.2 1 2.8 1 4 0M4 14l-2-1M20 14l2-1"/>',
  };
  return `<svg class="doodle-icon" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${shapes[name] || shapes.spark}</svg>`;
}
function brandMark() { return `<span class="brand-mark" aria-hidden="true"><img src="./assets/brand-donkey.png" alt="" width="40" height="40" decoding="async"/></span>`; }
const journalMonths = ['January','February','March','April','May','June','July','August','September','October','November','December'];
function journalDoodle(className = 'journal-doodle') { return `<img class="brand-mascot ${className}" src="./assets/brand-donkey.png" alt="" aria-hidden="true" width="720" height="720" decoding="async"/>`; }
function recordFace(status) {
  const mouth = status === 'complete' ? '<path d="M11 20c3 4 7 4 10 0"/>' : status === 'rest' ? '<path d="M10 15h4m5 0h4M14 22h5"/>' : '<path d="M12 21c2-2 6-2 8 0"/>';
  return `<svg class="record-face" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" aria-hidden="true">${status !== 'rest' ? '<path d="M11 14h.2m9 0h.2"/>' : ''}${mouth}</svg>`;
}
function journalWeek() {
  const today = new Date();
  const first = new Date(today); first.setDate(today.getDate() - today.getDay());
  const cells = Array.from({length:7}, (_, index) => {
    const day = new Date(first); day.setDate(first.getDate() + index);
    const key = dateKey(day); const record = state.dailyRecords[key];
    return `<div class="week-day ${key === dateKey() ? 'is-today' : ''} ${record ? 'has-record ' + record.status : ''}"><span class="week-label">${['S','M','T','W','T','F','S'][index]}</span><span class="week-number">${day.getDate()}</span>${record ? recordFace(record.status) : ''}</div>`;
  });
  return `<section class="journal-week"><div class="week-heading"><span>这一周，慢慢来</span><button class="text-button" data-action="view-records">翻开手账 ${icon('arrow',12)}</button></div><div class="week-grid">${cells.join('')}</div></section>`;
}

function logoSvg() { return journalDoodle('onboard-logo'); }
// 每组坐标为头、肩、肘、手、髋、膝、足；同一动作的起止姿势共享固定支撑点。
const exercisePoses = {
  'wall-protraction': { view:'侧视', cue:'手掌贴墙 · 手肘自然伸直', prop:'wall', a:[[86,29],[85,49],[116,57],[150,57],[79,91],[67,112],[58,132]], b:[[80,29],[79,49],[114,57],[150,57],[79,91],[67,112],[58,132]] },
  'prone-y': { view:'俯卧侧视', cue:'额头有支撑 · 手臂小幅上举', prop:'floor', a:[[131,100],[118,103],[137,106],[157,109],[78,112],[60,121],[45,126]], b:[[131,100],[118,101],[137,87],[157,77],[78,112],[60,121],[45,126]] },
  'scapular-retraction': { view:'侧视 · 肩胛位置示意', cue:'轻柔后移 · 回程放松', prop:'none', a:[[96,27],[96,49],[100,72],[102,94],[98,95],[91,114],[88,132]], b:[[93,27],[90,49],[94,72],[96,94],[98,95],[91,114],[88,132]] },
  'lat-pulldown': { view:'正面示意', cue:'坐稳 · 手肘向下 · 控制回程', prop:'pulldown', a:[[100,37],[100,57],[80,43],[66,25],[100,95],[118,105],[122,127]], b:[[100,37],[100,57],[75,76],[66,57],[100,95],[118,105],[122,127]] },
  'band-external-rotation': { view:'俯视 · 单侧示意', cue:'肘部靠近身体 · 前臂向外转', prop:'band', a:[[100,26],[100,48],[100,78],[119,78],[100,97],[88,113],[80,130]], b:[[100,26],[100,48],[100,78],[108,58],[100,97],[88,113],[80,130]] },
  'wall-posture': { view:'侧视', cue:'自然靠墙 · 放松呼吸', prop:'back-wall', hold:true, a:[[89,27],[92,50],[97,74],[100,96],[95,96],[90,114],[86,132]], b:[[89,27],[92,50],[97,74],[100,96],[95,96],[90,114],[86,132]] },
  'shoulder-raise': { view:'斜前方示意', cue:'小幅抬臂 · 避免耸肩', prop:'none', a:[[100,27],[100,49],[103,72],[106,95],[100,95],[89,114],[84,132]], b:[[100,27],[100,49],[118,50],[136,51],[100,95],[89,114],[84,132]] },
  'shoulder-rotation': { view:'俯视 · 单侧示意', cue:'上臂靠近身体 · 肘部不动', prop:'none', a:[[100,26],[100,48],[100,78],[119,78],[100,97],[88,113],[80,130]], b:[[100,26],[100,48],[100,78],[108,58],[100,97],[88,113],[80,130]] },
  'glute-bridge': { view:'侧视', cue:'肩与脚稳定 · 髋部缓慢抬起', prop:'floor', a:[[45,116],[57,116],[68,124],[82,125],[96,122],[126,96],[140,126]], b:[[45,116],[57,116],[68,124],[82,125],[96,98],[126,96],[140,126]] },
  'chair-squat': { view:'侧视', cue:'脚掌踩稳 · 髋部向后坐', prop:'chair', a:[[90,27],[91,48],[75,62],[64,72],[98,88],[88,109],[82,130]], b:[[76,50],[77,68],[63,78],[52,87],[116,96],[94,100],[82,130]] }
};

// Shared joint figure: preview loops use the action tempo; the player uses its actual clock.
function teachingFigure(action, animated = false, position = null, playback = null) {
  const spec = exercisePoses[action?.id];
  if (!spec) return '<svg class="exercise-figure teaching-figure" viewBox="0 0 200 160" role="img" aria-label="暂无动作示意"><rect width="200" height="160" rx="12" fill="#201815"/><text x="100" y="80" text-anchor="middle" fill="#c7b9b1" font-size="11">暂无动作示意</text></svg>';
  const reduced = Boolean(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const auto = animated && !reduced && (playback ? playback.running : position === null);
  const duration = spec.hold ? 4 : Math.max(1, Math.min(10, Number(action.tempo) || 4));
  const offset = playback ? (Math.max(0, Number(playback.elapsed) || 0) / 1000) % duration : 0;
  const t = position === null ? 0 : Math.max(0, Math.min(1, Number(position) || 0));
  const mix = (a, b, fraction) => a.map((point, i) => point.map((v, j) => +(v + (b[i][j] - v) * fraction).toFixed(2)));
  const points = mix(spec.a, spec.b, t);
  const animation = (attribute, a, b, breathing = false) => auto && (!spec.hold || breathing) && a !== b
    ? `<animate attributeName="${attribute}" values="${a};${b};${a}" keyTimes="0;0.5;1" dur="${duration}s" begin="-${offset.toFixed(3)}s" repeatCount="indefinite"/>` : '';
  const segment = (p, indexes) => indexes.map((i, n) => `${n ? 'L' : 'M'}${p[i].join(' ')}`).join(' ');
  const body = (p) => `${segment(p, [1,4,5,6])} ${segment(p, [1,2,3])}`;
  const line = (indexes, cssClass) => `<path class="${cssClass}" d="${segment(points, indexes)}">${animation('d', segment(spec.a, indexes), segment(spec.b, indexes))}</path>`;
  const mirror = (p) => p.map(([x,y]) => [200-x,y]);
  const bilateral = action.id === 'lat-pulldown';
  const props = {
    wall: '<path d="M153 20v115m0-108 6-5m-6 19 6-5m-6 19 6-5m-6 19 6-5m-6 19 6-5m-6 19 6-5m-6 19 6-5m-6 19 6-5"/>',
    'back-wall': '<path d="M75 18v118m0-109-6-5m6 19-6-5m6 19-6-5m6 19-6-5m6 19-6-5m6 19-6-5m6 19-6-5m6 19-6-5"/>',
    floor: '<path d="M25 134h146"/>',
    chair: '<path d="M112 100h42V75m0 25v32m-38-32v32"/>',
    pulldown: `<path d="M38 132V14h124v118M100 14v9M78 104h44v27"/><path class="motion-cable" d="M100 14V${points[3][1]}">${animation('d', 'M100 14V25', 'M100 14V57')}</path><path class="motion-bar" d="M66 ${points[3][1]}h68">${animation('d','M66 25h68','M66 57h68')}</path>`,
    band: `<path class="motion-band" d="M40 78L${points[3].join(' ')}">${animation('d',`M40 78L${spec.a[3].join(' ')}`,`M40 78L${spec.b[3].join(' ')}`)}</path><circle cx="40" cy="78" r="2.5"/>`,
    none: ''
  };
  const joints = (pa, pb, current, indexes = [1,2,3,4,5,6]) => indexes.map((i) => `<circle class="motion-joint ${i === 1 || i === 2 ? 'motion-joint-active' : ''}" cx="${current[i][0]}" cy="${current[i][1]}" r="${i === 1 ? 3.5 : 2.6}">${animation('cx',pa[i][0],pb[i][0])}${animation('cy',pa[i][1],pb[i][1])}</circle>`).join('');
  // Dashed reference pose and a direction chevron are present even for small-range actions.
  const target = spec.hold ? '' : `<path class="motion-target" d="${body(spec.b)}"/>`;
  let tracks = '';
  const tracked = action.id === 'glute-bridge' || action.id === 'chair-squat' ? [4] : [3,1];
  if (!spec.hold) for (const i of tracked) {
    const a = spec.a[i], b = spec.b[i];
    const length = Math.hypot(b[0]-a[0], b[1]-a[1]);
    if (length < 2) continue;
    const dx = b[0]-a[0], dy = b[1]-a[1], ux = dx/length, uy = dy/length;
    const bend = Math.min(9, length * 0.2);
    const middle = [(a[0]+b[0])/2-uy*bend,(a[1]+b[1])/2+ux*bend];
    tracks += `<path class="motion-trail" d="M${a.join(' ')} Q${middle.join(' ')} ${b.join(' ')}"/><path class="motion-arrow" d="M${b[0]-ux*4-uy*2.4} ${b[1]-uy*4+ux*2.4} L${b.join(' ')} L${b[0]-ux*4+uy*2.4} ${b[1]-uy*4-ux*2.4}"/>`;
  }
  if (spec.hold) tracks = `<circle class="motion-breath" cx="116" cy="65" r="9">${animation('r',9,15,true)}${animation('opacity',0.8,0.25,true)}</circle><path class="motion-trail" d="M114 52q12 4 12 14m-2-4 2 4 3-3"/>`;
  const neck = (p) => `M${p[0][0]} ${p[0][1]+12} L${p[1].join(' ')}`;
  const feet = (p) => `M${p[6].join(' ')}h11`;
  const secondSide = bilateral ? `<path class="motion-body" d="${body(mirror(points))}">${animation('d',body(mirror(spec.a)),body(mirror(spec.b)))}</path><path class="motion-active" d="${segment(mirror(points),[1,2])}">${animation('d',segment(mirror(spec.a),[1,2]),segment(mirror(spec.b),[1,2]))}</path>${joints(mirror(spec.a),mirror(spec.b),mirror(points),[2,3,5,6])}` : '';
  const description = `${action.name}，${spec.view}，${spec.cue}；关节点与虚线路径动作示意，未经过专业审核`;
  return `<svg viewBox="0 0 200 160" role="img" aria-label="${escapeHtml(description)}" data-motion-id="${escapeHtml(action.id)}" data-motion-position="${t.toFixed(3)}" data-motion-state="${auto ? 'playing' : 'still'}" class="exercise-figure teaching-figure"><rect class="motion-background" width="200" height="160" rx="12"/><g fill="none" stroke-linecap="round" stroke-linejoin="round"><g class="motion-prop">${props[spec.prop] || ''}</g>${target}${tracks}<path class="motion-body motion-neck" d="${neck(points)}">${animation('d',neck(spec.a),neck(spec.b))}</path>${line([1,4,5,6], 'motion-body')}${line([1,2,3], 'motion-body')}${secondSide}${line(action.id === 'glute-bridge' || action.id === 'chair-squat' ? [1,4] : [1,2], 'motion-active-glow')}${line(action.id === 'glute-bridge' || action.id === 'chair-squat' ? [1,4] : [1,2], 'motion-active')}<path class="motion-body" d="${feet(points)}">${animation('d',feet(spec.a),feet(spec.b))}</path><circle class="motion-head" cx="${points[0][0]}" cy="${points[0][1]}" r="12">${animation('cx',spec.a[0][0],spec.b[0][0])}${animation('cy',spec.a[0][1],spec.b[0][1])}</circle>${joints(spec.a,spec.b,points)}</g><text class="motion-view" x="11" y="13">${escapeHtml(spec.view)}</text><g class="motion-legend"><path class="motion-active" d="M12 149h9"/><text x="26" y="151">动作重点</text><path class="motion-trail" d="M83 149h12"/><text x="100" y="151">${spec.hold ? '呼吸提示' : '运动轨迹'}</text></g></svg>`;
}
function actionFigure(action, animated = false, position = null, playback = null) { return teachingFigure(action, animated, position, playback); }
function actionArt(action, large = false) { return `<div class="${large ? 'detail-illustration' : 'action-art'}">${actionFigure(action, true)}${large ? `<span class="figure-label">${escapeHtml(exercisePoses[action.id]?.cue || '动作示意')} · ${exercisePoses[action.id]?.hold ? '呼吸提示' : '循环播放'}</span>` : ''}</div>`; }

function statusLabel(status) { return status === 'completed' ? '已完成' : status === 'skipped' ? '已跳过' : status === 'in-progress' ? '进行中' : '未开始'; }

function render() {
  const root = document.getElementById('app');
  if (ui.screen === 'onboarding') { root.innerHTML = renderOnboarding(); return; }
  if (ui.screen === 'player') { root.innerHTML = renderPlayer(); ensureTick(); return; }
  if (ui.screen === 'summary') { root.innerHTML = renderSummary(); return; }
  root.innerHTML = renderMain();
}

function renderOnboarding() {
  const step = ui.onboardingStep;
  const steps = [
    { title: '先听听你的节奏', body: '不做诊断，只帮你筛选更适合当下的演示计划。', render: () => `<div class="onboard-illustration">${logoSvg('yellow')}</div>` },
    { title: '你通常在哪里练？', body: '之后也可以在“我的”里修改。', render: () => choiceGrid('scene', [['居家', '空间更灵活'], ['健身房', '器械更完整']]) },
    { title: '手边有什么器械？', body: '高位下拉动作仅在你选择有器械时出现。', render: () => choiceGrid('equipment', [['无器械', '只用身体与墙面'], ['弹力带', '轻量阻力辅助'], ['高位下拉器械', '握距可自行调整']]) },
    { title: '你对训练熟悉吗？', body: '参数只是演示默认值，不代表个体化处方。', render: () => choiceGrid('experience', [['初次训练', '先从可控开始'], ['有基础', '已有训练习惯']]) },
    { title: '今天大约有多久？', body: '计划会根据可用时间给出建议，不要求一次完成全部动作。', render: () => choiceGrid('minutes', [['10', '10分钟左右'], ['15', '15分钟左右'], ['25', '25分钟左右'], ['30', '30分钟以上']]) },
    { title: '最后两件小事', body: '提醒与专业建议都可以稍后再设置。', render: () => `<div class="choice-grid"><button class="choice-btn ${ui.onboardingDraft.reminder ? 'selected' : ''}" data-action="onboard-toggle" data-field="reminder"><strong>设置训练提醒</strong><span>${ui.onboardingDraft.reminder ? '已选择，稍后确认权限' : '先不设置也可以'}</span></button><button class="choice-btn ${ui.onboardingDraft.professionalAdvice ? 'selected' : ''}" data-action="onboard-toggle" data-field="professionalAdvice"><strong>有专业建议</strong><span>${ui.onboardingDraft.professionalAdvice ? '会优先保留你的建议' : '暂无或不确定'}</span></button></div><div class="notice">请在舒适范围内训练。如有疼痛、明显无力、麻木或近期损伤，请先咨询专业人员。以上信息仅用于筛选预设模板，不生成医学诊断。</div>` },
  ];
  const current = steps[step];
  return `<div class="onboarding"><div class="onboard-brand">${brandMark()}<div><h1>不许奓毛</h1><div class="brand-subtitle">肩胛训练 · 每日跟练</div></div></div><div class="onboard-main"><p class="eyebrow">${step === 0 ? '每天一点，让肩背更自在' : `偏好设置 · ${step}/5`}</p><div class="onboard-card"><div class="onboard-step">${step === 0 ? '从 1 分钟了解开始' : '这些选择只用来筛选演示计划'}</div><h2>${current.title}</h2><p class="subtle">${current.body}</p>${current.render()}<div class="onboard-footer">${step > 0 ? `<button class="secondary-btn" data-action="onboard-back">返回</button>` : ''}<button class="primary-btn" data-action="onboard-next">${step === 0 ? '开始设置' : step === steps.length - 1 ? '生成今日计划' : '下一步'}</button></div></div></div><div class="subtle hand-copy">可离线使用 · 数据只保存在本机</div></div>`;
}
function choiceGrid(field, choices) { return `<div class="choice-grid">${choices.map(([value, note]) => `<button class="choice-btn ${String(ui.onboardingDraft[field]) === value ? 'selected' : ''}" data-action="onboard-choice" data-field="${field}" data-value="${value}"><strong>${value}${field === 'minutes' ? ' 分钟' : ''}</strong><span>${note}</span></button>`).join('')}</div>`; }

function renderMain() {
  const tabs = { home: ['首页', 'home'], library: ['动作库', 'book'], records: ['记录', 'calendar'], profile: ['我的', 'user'] };
  return `<div class="app-shell"><div class="app-content"><header class="topbar"><div class="brand-lockup">${brandMark()}<div><h1 class="brand-name">不许奓毛</h1><div class="brand-subtitle">肩胛训练 · 每日跟练</div></div></div><div class="top-actions"><span class="pill yellow">${doodleIcon('heart', 13)} 连续 ${calculateStats().streak} 天</span><button class="icon-btn" data-action="open-plan" aria-label="查看周期计划">${doodleIcon('calendar', 20)}</button></div></header>${ui.tab === 'home' ? renderHome() : ui.tab === 'library' ? renderLibrary() : ui.tab === 'records' ? renderRecords() : renderProfile()}</div><nav class="bottom-nav"><div class="bottom-nav-inner">${Object.entries(tabs).map(([key, [label, iconName]]) => `<button class="nav-btn ${ui.tab === key ? 'active' : ''}" data-action="tab" data-tab="${key}">${doodleIcon(iconName, 23)}<span>${label}</span></button>`).join('')}</div></nav>${renderModal()}${ui.toast ? `<div class="toast">${escapeHtml(ui.toast)}</div>` : ''}</div>`;
}

function renderHome() {
  const snapshot = ensurePlanSnapshot();
  const record = state.dailyRecords[dateKey()];
  const progress = state.activeSession ? activeSessionProgress(state.activeSession) : { completed: record?.completedSets || 0, total: totalSets(snapshot), ratio: record ? Math.min(1, (record.completedSets || 0) / Math.max(1, totalSets(snapshot))) : 0 };
  const todayType = planDayType(planDay());
  const actionStatusMap = {};
  if (state.activeSession) state.activeSession.sets.forEach((set) => { const action = snapshot.actions.find((item) => item.id === set.actionId); if (action) { actionStatusMap[action.id] = actionStatusMap[action.id] || []; actionStatusMap[action.id][set.setIndex] = set.status; } });
  return `<section class="journal-hero"><div class="journal-hero-copy"><p class="journal-date">${journalMonths[new Date().getMonth()]}<span>${formatDate()}</span></p><h1 class="paper-label">${escapeHtml(ui.homeCopy.title)}</h1><p class="pencil-caption">肩背日记 · 第 ${planDay()} 天</p></div>${journalDoodle()}<span class="hero-handnote">慢慢来，也很好。</span></section>${journalWeek()}<section class="plan-card"><div class="plan-top"><div><p class="eyebrow paper-label small-paper">今日练习清单</p><h2>${escapeHtml(state.activePlan?.name || '7天训练体验计划')}</h2><p class="subtle">${snapshot.actions.length} 个动作 · ${progress.total} 组 · 预计 ${Math.ceil(plannedSeconds(snapshot) / 60)} 分钟</p></div><div class="day-bubble"><div><strong>${planDay()}</strong><small>DAY</small></div></div></div><div class="plan-meta"><span class="pill">${doodleIcon('home',12)} ${state.preferences?.scene || '居家'}</span><span class="pill">${state.preferences?.equipment || '无器械'}</span><span class="pill">${progress.completed}/${progress.total} 组</span></div><div class="progress-row"><span>今日进度</span><div class="progress-track"><div class="progress-fill" style="width:${Math.round(progress.ratio * 100)}%"></div></div><span>${Math.round(progress.ratio * 100)}%</span></div><button class="primary-btn" data-action="start-training">${state.activeSession ? '继续训练' : record?.completedSets >= progress.total ? '查看今日记录' : '开始训练'} ${icon('arrow', 16)}</button></section><div class="section-head"><h2><span class="section-icon">${doodleIcon('sprout', 19)}</span>${escapeHtml(ui.homeCopy.section)}</h2><button class="text-button" data-action="open-plan">查看周期计划 ${icon('arrow', 13)}</button></div><div class="action-list">${snapshot.actions.map((action) => renderActionCard(action, actionStatusMap[action.id])).join('')}</div><div class="notice" style="margin-top:16px"><span class="cute-caption">${doodleIcon('heart', 16)} 训练提示</span><br/>这些是可编辑的演示默认参数，不作为所有用户通用的康复处方。任何不适都可以暂停或停止。</div>`;
}
function renderActionCard(action, statuses = []) {
  const done = statuses.filter((status) => status === 'completed').length;
  const skipped = statuses.filter((status) => status === 'skipped').length;
  const status = done === action.sets ? 'completed' : done || skipped ? 'in-progress' : 'pending';
  const target = action.mode === 'hold' ? `${action.sets}组 × ${action.holdSeconds}秒` : `${action.sets}组 × ${action.reps}次`;
  return `<article class="action-card"><button class="action-art" data-action="open-action" data-id="${action.id}" aria-label="查看${escapeHtml(action.name)}教程">${actionFigure(action, true)}</button><div class="action-info"><div class="action-title-row"><h3>${escapeHtml(action.name)}</h3><span class="pill ${action.equipment === '无器械' ? 'sage' : action.equipment === '弹力带' ? 'yellow' : 'pink'}">${escapeHtml(action.category)}</span></div><div class="action-detail"><span>${target}</span><span class="action-dot">·</span><span>每组约 ${actionDuration(action)} 秒</span><span class="action-dot">·</span><span>休息 ${action.rest} 秒</span></div><div class="action-status ${status === 'completed' ? 'done' : status === 'in-progress' ? '' : ''}">${status === 'completed' ? `${icon('check', 13)} 已完成 ${done}/${action.sets} 组` : status === 'in-progress' ? `进行中 · 已完成 ${done}/${action.sets} 组${skipped ? ` · 跳过 ${skipped} 组` : ''}` : '未开始'} <span style="float:right;color:var(--muted)">可调整</span></div><div class="action-actions"><button class="small-action" data-action="open-action" data-id="${action.id}">详细教程</button><span class="action-dot">·</span>${renderVideoLink(action, 'card')}<span class="action-dot">·</span><button class="small-action" data-action="open-action" data-id="${action.id}">调整参数</button></div></div></article>`;
}

function renderLibrary() {
  const filters = ['全部', '肩胛', '肩部', '臀腿', '无器械', '弹力带', '高位下拉器械'];
  const list = state.actions.filter((action) => (ui.filter === '全部' || action.equipment === ui.filter || action.bodyPart === ui.filter || (ui.filter === '肩胛' && !action.bodyPart)) && (!ui.query || action.name.includes(ui.query) || action.category.includes(ui.query) || (action.bodyPart || '肩胛').includes(ui.query)));
  return `<section><p class="eyebrow">${doodleIcon('book', 14)} 动作库</p><h1>慢一点，也算进步</h1><p class="subtle">按器械、部位和动作名称筛选。每个动作都能查看详细文字教程和对应的真人视频示范。</p><input class="search-field" data-field="library-query" value="${escapeHtml(ui.query)}" placeholder="搜索动作名称"/><div class="filter-row">${filters.map((filter) => `<button class="filter-chip ${ui.filter === filter ? 'active' : ''}" data-action="library-filter" data-value="${filter}">${filter}</button>`).join('')}</div><div class="library-grid">${list.map((action) => `<article class="library-card" data-action="open-action" data-id="${action.id}"><div class="library-card-top">${actionFigure(action, true)}<span class="tag">${escapeHtml(action.bodyPart || '肩胛')}</span></div><div class="library-card-body"><h3>${escapeHtml(action.name)}</h3><p class="subtle">${escapeHtml(action.equipment)} · ${action.mode === 'hold' ? `${action.holdSeconds}秒保持` : `${action.reps}次 × ${action.tempo}秒节奏`} · 可调整</p>${renderVideoLink(action, 'card')}</div></article>`).join('')}</div></section>`;
}

function renderRecords() {
  const stats = calculateStats();
  const selected = state.dailyRecords[ui.selectedDate];
  return `<section class="journal-records"><p class="eyebrow records-eyebrow">${doodleIcon('records',14)} 我的训练手账</p>${renderCalendar()}<div class="journal-note"><h1 class="paper-label">每天一点，也很好。</h1>${journalDoodle('note-doodle')}<p class="pencil-caption">练过的日子，都记得。</p></div><div class="stat-grid"><div class="stat-card"><span class="stat-value">${stats.days}</span><span class="stat-label">累计训练天数</span></div><div class="stat-card"><span class="stat-value">${stats.streak}</span><span class="stat-label">连续训练天数</span></div><div class="stat-card"><span class="stat-value">${formatTime(stats.effectiveMs)}</span><span class="stat-label">累计有效时间</span></div></div>${selected ? renderSelectedRecord(selected) : '<div class="detail-card"><p class="subtle" style="margin:0">点一个日期，看看那天的练习。表情仅代表训练记录状态。</p></div>'}<div class="section-head"><h2>近 7 天的小积累</h2><span class="subtle">有效训练时间</span></div><div class="detail-card">${renderTrend()}</div><div class="stack-buttons"><button class="secondary-btn wide-btn" data-action="manual-record">${icon('plus',16)} 手动补记一次训练</button><button class="quiet-btn wide-btn" data-action="mark-rest">${icon('moon',16)} 将今天标记为休息日</button></div></section>`;
}
function renderCalendar() {
  const year = ui.calendarDate.getFullYear(); const month = ui.calendarDate.getMonth();
  const first = new Date(year, month, 1); const last = new Date(year, month + 1, 0); const days = [];
  for (let index = 0; index < first.getDay(); index += 1) days.push('<span></span>');
  const statusLabels = { complete:'完整完成', partial:'部分完成', rest:'休息日' };
  for (let day = 1; day <= last.getDate(); day += 1) {
    const key = `${year}-${pad(month+1)}-${pad(day)}`; const record = state.dailyRecords[key];
    days.push(`<button class="calendar-day ${key === dateKey() ? 'today' : ''} ${key === ui.selectedDate ? 'selected' : ''} ${record ? 'recorded ' + record.status : ''}" data-action="select-date" data-date="${key}" aria-label="${month+1}月${day}日，${record ? statusLabels[record.status] || '有记录' : '暂无记录'}" aria-pressed="${key === ui.selectedDate}"><span class="day-digit">${day}</span>${record ? recordFace(record.status) : ''}</button>`);
  }
  return `<div class="calendar-card"><div class="calendar-header"><button class="small-icon-btn" data-action="calendar-prev" aria-label="上一个月">${icon('chevronLeft')}</button><div class="calendar-title"><span class="month-name">${journalMonths[month]}</span><span class="calendar-year">${year} / ${month+1}月</span></div><button class="small-icon-btn" data-action="calendar-next" aria-label="下一个月">${icon('chevronRight')}</button></div><div class="calendar-week">${['S','M','T','W','T','F','S'].map(day=>'<span>'+day+'</span>').join('')}</div><div class="calendar-grid">${days.join('')}</div><div class="legend"><span><i class="legend-face complete">${recordFace('complete')}</i>完整完成</span><span><i class="legend-face partial">${recordFace('partial')}</i>部分完成</span><span><i class="legend-face rest">${recordFace('rest')}</i>休息日</span></div></div>`;
}
function renderSelectedRecord(record) { return `<div class="detail-card"><div class="section-head" style="margin:0 0 5px"><h3>${record.date === dateKey() ? '今天' : record.date}</h3><span class="pill ${record.status === 'complete' ? 'sage' : record.status === 'rest' ? '' : 'yellow'}">${record.status === 'complete' ? '完整完成' : record.status === 'rest' ? '休息日' : '部分完成'}${record.manual ? ' · 含手动记录' : ''}</span></div>${record.status === 'rest' ? '<p class="subtle" style="margin:0">给身体一点恢复空间。休息日不计入连续训练天数。</p>' : `<div class="detail-row"><span>完成组数</span><strong>${record.completedSets || 0}${record.totalSets ? ` / ${record.totalSets}` : ''}</strong></div><div class="detail-row"><span>有效训练时间</span><strong>${formatTime(record.effectiveMs)}</strong></div><div class="detail-row"><span>休息时间</span><strong>${formatTime(record.restMs || 0)}</strong></div><div class="detail-row"><span>训练次数</span><strong>${record.sessions || 0} 次</strong></div>`}</div>`; }
function renderTrend() { const days = []; for (let index = 6; index >= 0; index -= 1) { const date = new Date(); date.setDate(date.getDate() - index); const key = dateKey(date); const value = state.dailyRecords[key]?.effectiveMs || 0; days.push({ label: `${date.getMonth() + 1}/${date.getDate()}`, value }); } const max = Math.max(...days.map((day) => day.value), 1); return `<div class="trend">${days.map((day) => `<div class="trend-day"><div class="trend-bar ${day.value ? 'has-value' : ''}" style="height:${Math.max(6, Math.round(day.value / max * 58))}px"></div><span class="trend-label">${day.label}</span></div>`).join('')}</div>`; }

function renderProfile() {
  const permissionText = state.reminder.permission === 'granted' ? '浏览器权限已授权；静态 PWA 不保证关闭页面后定时送达' : state.reminder.permission === 'denied' ? '浏览器通知权限被拒绝，可在系统设置中重新开启' : '仅在取得浏览器权限后才会显示已开启';
  return `<section><div class="profile-header"><div class="profile-avatar">${journalDoodle('profile-illustration')}</div><div><p class="eyebrow">${doodleIcon('heart', 14)} 我的空间</p><h1>让肩背，<br/>回到自己的节奏</h1><p class="subtle" style="margin:0">${state.preferences?.scene || '居家'} · ${state.preferences?.equipment || '无器械'} · ${state.preferences?.experience || '初次训练'}</p></div></div><div class="plan-mini"><div><strong>${escapeHtml(state.activePlan?.name || '7天训练体验计划')}</strong><div class="subtle">第 ${planDay()} / ${planLength()} 天 · 可随时调整</div></div><button class="secondary-btn" data-action="open-plan">查看计划</button></div><div class="section-head"><h2><span class="section-icon">${doodleIcon('spark', 19)}</span>训练设置</h2></div><div class="settings-card"><div class="setting-row"><div class="setting-copy"><div class="setting-title">准备时间</div><div class="setting-description">开始每个训练会话前的准备倒计时</div></div><div class="setting-control"><input type="number" min="0" max="60" value="${state.settings.prepSeconds}" data-setting="prepSeconds" aria-label="准备时间秒数"/> 秒</div></div><div class="setting-row"><div class="setting-copy"><div class="setting-title">动作切换</div><div class="setting-description">完成一个动作后，进入下一个动作前的时间</div></div><div class="setting-control"><input type="number" min="0" max="90" value="${state.settings.transitionSeconds}" data-setting="transitionSeconds" aria-label="动作切换秒数"/> 秒</div></div><div class="setting-row"><div class="setting-copy"><div class="setting-title">声音提示</div><div class="setting-description">剩余3秒和阶段切换时提示</div></div><div class="setting-control"><label class="switch"><input type="checkbox" ${state.settings.sound ? 'checked' : ''} data-setting="sound"/><span class="slider"></span></label></div></div><div class="setting-row"><div class="setting-copy"><div class="setting-title">震动提示</div><div class="setting-description">设备支持时在阶段切换时轻震</div></div><div class="setting-control"><label class="switch"><input type="checkbox" ${state.settings.vibration ? 'checked' : ''} data-setting="vibration"/><span class="slider"></span></label></div></div></div><div class="section-head"><h2><span class="section-icon">${doodleIcon('bell', 19)}</span>训练提醒</h2></div><div class="settings-card"><div class="setting-row"><div class="setting-copy"><div class="setting-title">${doodleIcon('bell', 15)} 训练提醒</div><div class="setting-description">${permissionText}</div></div><div class="setting-control"><label class="switch"><input type="checkbox" ${state.reminder.enabled ? 'checked' : ''} data-setting="reminderEnabled"/><span class="slider"></span></label></div></div><div class="setting-row"><div class="setting-copy"><div class="setting-title">提醒时间</div><div class="setting-description">仅保存偏好时间；本地静态版本不承诺后台定时触达</div></div><div class="setting-control"><input type="time" value="${state.reminder.time}" data-setting="reminderTime"/></div></div></div><div class="section-head"><h2><span class="section-icon">${doodleIcon('book', 19)}</span>数据与说明</h2></div><div class="stack-buttons"><button class="secondary-btn wide-btn" data-action="export-data">${icon('download', 16)} 导出本地数据</button><button class="secondary-btn wide-btn" data-action="import-data">${icon('upload', 16)} 导入数据</button><button class="quiet-btn wide-btn" data-action="show-about">${icon('info', 16)} 产品说明与隐私说明</button><button class="danger-btn wide-btn" data-action="clear-data">清空本机数据</button></div></section>`;
}

function renderModal() {
  if (!ui.modal) return '';
  if (ui.modal.type === 'action') return renderActionModal(getAction(ui.modal.id));
  if (ui.modal.type === 'plan') return renderPlanModal();
  if (ui.modal.type === 'about') return renderAboutModal();
  if (ui.modal.type === 'confirm') return renderConfirmModal(ui.modal.kind);
  return '';
}
function renderConfirmModal(kind) {
  const copy = kind === 'clear'
    ? { eyebrow: '清空本机数据', title: '确定要从头开始吗？', body: '偏好、计划、训练会话、日历和设置都会从当前浏览器删除，且无法恢复。', confirm: '确认清空', action: 'confirm-clear' }
    : kind === 'discomfort'
      ? { eyebrow: '先照顾身体', title: '停止训练并保存已有记录？', body: '已完成组会保留，未完成或跳过的内容不会计入完成。', confirm: '停止并保存', action: 'confirm-discomfort' }
      : { eyebrow: '结束本次训练', title: '保存已完成部分吗？', body: '未完成内容不会计入完成；这次会话会按真实完成比例保存。', confirm: '保存并结束', action: 'confirm-end' };
  return `<div class="modal-backdrop" data-action="close-modal"><div class="modal-sheet" data-modal-content><div class="modal-header"><div><p class="eyebrow">${copy.eyebrow}</p><h2>${copy.title}</h2></div><button class="close-btn" data-action="close-modal">${icon('close')}</button></div><div class="info-block"><p style="margin:0">${copy.body}</p></div><div class="modal-actions"><button class="${kind === 'clear' ? 'danger-btn' : 'primary-btn'} wide-btn" data-action="${copy.action}">${copy.confirm}</button><button class="secondary-btn wide-btn" data-action="close-modal">先不结束</button></div></div></div>`;
}
function renderActionModal(action) {
  if (!action) return '';
  action = { ...action, ...(tutorialGuides[action.id] || {}) };
  const editing = Boolean(ui.modal?.editing);
  const draft = ui.modal?.draft || action;
  const parameterEditor = editing ? `<div class="info-block"><h3>调整训练参数</h3><p class="subtle">修改只影响之后生成的计划；正在进行的历史会话保持原计划快照。</p><div class="choice-grid" style="margin-top:10px"><label class="setting-copy"><span class="setting-description">组数</span><input class="setting-input" type="number" min="1" max="8" value="${draft.sets}" data-edit-field="sets"/></label><label class="setting-copy"><span class="setting-description">${action.mode === 'hold' ? '保持秒数' : '次数'}</span><input class="setting-input" type="number" min="1" max="120" value="${action.mode === 'hold' ? draft.holdSeconds : draft.reps}" data-edit-field="${action.mode === 'hold' ? 'holdSeconds' : 'reps'}"/></label><label class="setting-copy"><span class="setting-description">${action.mode === 'hold' ? '节奏' : '每次秒数'}</span><input class="setting-input" type="number" min="1" max="10" value="${draft.tempo}" data-edit-field="tempo"/></label><label class="setting-copy"><span class="setting-description">组间休息秒数</span><input class="setting-input" type="number" min="0" max="180" value="${draft.rest}" data-edit-field="rest"/></label></div></div>` : '';
  return `<div class="modal-backdrop" data-action="close-modal"><div class="modal-sheet" data-modal-content><div class="modal-header"><div><p class="eyebrow">动作说明 · ${escapeHtml(action.category)}</p><h2>${escapeHtml(action.name)}</h2></div><button class="close-btn" data-action="close-modal">${icon('close')}</button></div>${actionArt(action, true)}${action.purpose ? `<div class="info-block"><h3>练习目的</h3><p>${escapeHtml(action.purpose)}</p></div>` : ''}<div class="info-block"><h3>准备姿势</h3><p>${escapeHtml(action.prep)}</p></div><div class="info-block"><h3>分步骤</h3><ol class="tutorial-steps">${action.steps.map((step) => `<li>${escapeHtml(step)}</li>`).join('')}</ol></div><div class="info-block"><h3>呼吸与节奏</h3><p>${escapeHtml(action.breath)} · ${action.mode === 'hold' ? `${action.holdSeconds} 秒持续保持` : `${action.reps} 次 × 每次约 ${action.tempo} 秒`}</p></div><div class="info-block"><h3>常见错误</h3><ul>${action.errors.map((error) => `<li>${escapeHtml(error)}</li>`).join('')}</ul></div>${action.scope ? `<div class="info-block"><h3>适用范围与调整</h3><p>${escapeHtml(action.scope)}</p></div>` : ''}${parameterEditor}${renderVideoLink(action, 'detail')}<div class="notice">注意事项：${escapeHtml(action.caution)}<br/>内置动画仅作动作示意；真人视频跳转第三方原站，视频变式和内容尚未由本应用康复专业人员审核。</div><div class="modal-actions">${editing ? `<button class="primary-btn wide-btn" data-action="save-action" data-id="${action.id}">${icon('check', 16)} 保存参数</button><button class="secondary-btn wide-btn" data-action="cancel-edit">取消修改</button>` : `<button class="primary-btn wide-btn" data-action="add-to-plan" data-id="${action.id}">加入今日计划</button><button class="secondary-btn wide-btn" data-action="edit-action" data-id="${action.id}">调整训练参数</button>`}</div></div></div>`;
}
function renderPlanModal() {
  const plans = [{ id: '7', name: '7天训练体验计划', desc: '给第一次建立节奏的你：训练日之间保留轻量活动与休息。' }, { id: '30', name: '30天训练习惯计划', desc: '把训练拆成可持续的小段，不因日期推进而自动加量。' }];
  const current = state.activePlan?.id || '7';
  const rows = Array.from({ length: current === '30' ? 10 : 7 }, (_, index) => { const day = index + 1; const type = planDayType(day); return `<div class="day-row"><div class="day-number">${day}</div><div><strong>第 ${day} 天 · ${type.label}</strong><span>${type.kind === 'rest' ? '给身体恢复空间' : type.kind === 'light' ? '轻量活动，按感受调整' : `${ensurePlanSnapshot().actions.length} 个动作 · 预计 ${Math.ceil(plannedSeconds() / 60)} 分钟`}</span></div></div>`; }).join('');
  return `<div class="modal-backdrop" data-action="close-modal"><div class="modal-sheet" data-modal-content><div class="modal-header"><div><p class="eyebrow">周期计划</p><h2>选择这段时间的节奏</h2></div><button class="close-btn" data-action="close-modal">${icon('close')}</button></div><div class="plan-options">${plans.map((plan) => `<button class="plan-option ${current === plan.id ? 'active' : ''}" data-action="choose-plan" data-id="${plan.id}"><div class="plan-option-head"><h3>${plan.name}</h3><span class="pill ${current === plan.id ? 'sage' : ''}">${current === plan.id ? '当前' : '选择'}</span></div><p>${plan.desc}</p></button>`).join('')}</div><div class="day-list">${rows}</div><div class="notice">计划只是安排工具，不是承诺。进阶以完成情况和主观感受为参考；不适时请暂停训练。</div></div></div>`;
}
function renderAboutModal() { return `<div class="modal-backdrop" data-action="close-modal"><div class="modal-sheet" data-modal-content><div class="modal-header"><div><p class="eyebrow">关于这款工具</p><h2>不许奓毛</h2></div><button class="close-btn" data-action="close-modal">${icon('close')}</button></div><div class="info-block"><h3>产品边界</h3><p>这是训练辅助与记录工具，不自动诊断翼状肩胛骨，不根据照片判断病因，也不承诺 7 天或 30 天矫正成功。正式上线前，动作内容和参数需要经过康复专业人员审核。</p></div><div class="info-block"><h3>本地数据</h3><p>偏好、计划快照、训练会话、组记录、日历汇总均保存在当前浏览器的 localStorage 中。不会自动上传云端。开始训练时会保存计划快照，之后调整动作不会改写历史记录。</p></div><div class="info-block"><h3>浏览器能力说明</h3><p>计时使用时间差计算，页面切后台会暂停并保存。声音使用浏览器能力，震动使用设备支持时的 Vibration API；浏览器通知需要权限，静态 PWA 不保证关闭页面后定时触达。</p></div><div class="info-block"><h3>视频教学</h3><p>每个动作均提供对应的第三方视频链接。链接打开原站，本应用不复制、下载或托管视频。不同视频可能展示动作变式、语言或器械差异；视频和本地文字尚未由本应用康复专业人员统一审核，请优先按详细文字和专业人员意见练习。</p></div><button class="primary-btn wide-btn" style="margin-top:15px" data-action="close-modal">我知道了</button></div></div>`; }

function renderPlayer() {
  const session = state.activeSession; const action = session.planSnapshot.actions[session.exerciseIndex]; const currentSet = session.currentSetIndex; const set = session.sets.find((item) => item.actionId === action.id && item.setIndex === currentSet); const progress = activeSessionProgress(session); const phase = session.phase; const remaining = phase === 'work' || phase === 'prepare' || phase === 'rest' || phase === 'transition' ? Math.max(0, (session.phaseEndsAt || Date.now()) - (session.isPaused ? (session.pausedAt || Date.now()) : Date.now())) : 0; const isCounting = phase === 'work' || phase === 'prepare' || phase === 'rest' || phase === 'transition'; const phaseText = { prepare: '准备一下', work: action.mode === 'hold' ? '保持 · 呼吸' : '跟着节奏', confirm: '本组完成了吗？', rest: '组间休息', transition: '动作切换中' }[phase] || '暂停'; const target = action.mode === 'hold' ? `目标保持 ${action.holdSeconds} 秒` : `${action.reps} 次 · 每次约 ${action.tempo} 秒`; const workElapsed = phase === 'work' ? Math.max(0, actionDuration(action) * 1000 - remaining) : actionDuration(action) * 1000; const rep = action.mode === 'reps' ? Math.min(action.reps, Math.max(1, Math.floor(workElapsed / (action.tempo * 1000)) + 1)) : null; const progressRatio = progress.total ? progress.completed / progress.total : 0;
  const cycleMs = Math.max(1000, (Number(action.tempo) || 4) * 1000);
  const cycleProgress = action.mode === 'reps' && phase === 'work' ? (workElapsed % cycleMs) / cycleMs : 0;
  const ballPosition = cycleProgress <= 0.5 ? cycleProgress * 2 : (1 - cycleProgress) * 2;
  const rhythmLabel = session.isPaused ? '已暂停' : phase === 'work' ? (action.mode === 'hold' ? '保持姿势 · 自然呼吸' : cycleProgress < 0.5 ? '动作阶段' : '回程阶段') : phase === 'confirm' ? '等待确认' : phase === 'rest' ? '休息中' : phase === 'transition' ? '准备切换' : '准备开始';
  let controls = '';
  if (phase === 'confirm') controls = `<button class="primary-btn player-main-btn" data-action="complete-set">${icon('check', 18)} 完成本组</button><button class="secondary-btn" data-action="skip-set">跳过本组</button><button class="secondary-btn" data-action="pause-session">${icon('pause', 16)} 暂停</button><button class="secondary-btn" data-action="open-action" data-id="${action.id}">看教程</button>`;
  else if (phase === 'rest' || phase === 'transition') controls = `<button class="primary-btn player-main-btn" data-action="skip-rest">跳过${phase === 'rest' ? '休息' : '切换'}</button><button class="secondary-btn" data-action="extend-rest">延长15秒</button><button class="secondary-btn" data-action="pause-session">${session.isPaused ? icon('play', 16) + ' 继续' : icon('pause', 16) + ' 暂停'}</button><button class="secondary-btn" data-action="skip-exercise">跳过动作</button>`;
  else controls = `<button class="primary-btn player-main-btn" data-action="${session.isPaused ? 'resume-session' : 'pause-session'}">${session.isPaused ? icon('play', 18) + ' 继续计时' : icon('pause', 18) + ' 暂停计时'}</button><button class="secondary-btn" data-action="complete-set">完成本组</button><button class="secondary-btn" data-action="skip-set">跳过本组</button><button class="secondary-btn" data-action="skip-exercise">跳过动作</button>`;
  return `<div class="player-shell"><div class="player-content"><div class="player-top"><button class="icon-btn" data-action="end-training" aria-label="结束训练">${icon('close')}</button><span class="player-index">${session.exerciseIndex + 1} / ${session.planSnapshot.actions.length}</span><span class="pill">${session.isPaused ? '已暂停' : '训练中'}</span></div><div class="player-heading"><p class="eyebrow player-eyebrow">${escapeHtml(action.category)} · 第 ${currentSet + 1}/${action.sets} 组</p><h1>${escapeHtml(action.name)}</h1><p class="subtle">${target}</p></div><div class="player-demo">${actionFigure(action, true, phase === 'work' && action.mode === 'reps' ? ballPosition : 0, { running: phase === 'work' && !session.isPaused, elapsed: workElapsed })}<span class="figure-label">${escapeHtml(exercisePoses[action.id]?.cue || '动作示意')} · 动作示意</span></div>${renderVideoLink(action, 'player')}<div class="rhythm-card" aria-label="节奏提示：${rhythmLabel}"><div class="rhythm-heading"><span>跟着小球慢慢来</span><span>${rhythmLabel}</span></div><div class="rhythm-track"><span class="rhythm-marker rhythm-start"></span><span class="rhythm-marker rhythm-end"></span><span class="rhythm-ball" style="left:${Math.round(ballPosition * 100)}%"></span></div><div class="rhythm-ends"><span>开始</span><span>${action.mode === 'hold' ? '舒适保持' : '动作 / 回程'}</span></div></div><div class="player-phase">${phaseText}</div><div class="player-timer">${isCounting ? formatClock(remaining) : phase === 'confirm' ? (rep ? `${rep}/${action.reps}` : '完成') : '暂停'}</div><div class="player-target">${phase === 'work' && rep ? `节奏参考 · 第 ${rep} 次` : phase === 'confirm' ? '计时结束或你已提前完成，请确认后再计入记录' : phase === 'rest' ? '下一组会自动开始，也可以提前跳过' : phase === 'transition' ? `下一动作：${session.exerciseIndex < session.planSnapshot.actions.length - 1 ? session.planSnapshot.actions[session.exerciseIndex + 1].name : '训练总结'}` : session.isPaused ? '暂停时间不会计入训练时间' : '跟着自己的呼吸与节奏'}</div>${phase === 'confirm' ? '<div class="confirm-card">重复点击“完成本组”不会重复记账。身体不适时，可以直接结束训练。</div>' : ''}<div class="player-progress"><div class="player-progress-line"><span>本次训练总体进度</span><span>${progress.completed}/${progress.total} 组</span></div><div class="progress-track"><div class="progress-fill" style="width:${Math.round(progressRatio * 100)}%"></div></div><div class="player-controls">${controls}</div><button class="player-link" data-action="stop-discomfort">身体不适，停止训练并保存已有记录</button></div></div></div>${renderModal()}`;
}

function renderSummary() {
  const session = ui.summary || state.sessions[state.sessions.length - 1];
  const progress = activeSessionProgress(session);
  const complete = session?.status === 'complete' || progress.completed >= progress.total;
  const title = complete ? '今天完成得很好' : progress.completed ? '今天先到这里' : '已保存这次记录';
  const note = complete ? '完整完成会自动记入今日打卡。明天继续按自己的节奏，不需要加量。' : progress.completed ? `本次完成了 ${progress.completed}/${progress.total} 组，真实比例会保留在记录里。` : '这次没有完成有效组，因此不会生成训练打卡。';
  return `<div class="summary-shell"><div class="summary-content"><div class="summary-hero"><div class="summary-star">${complete ? '✦' : '·'}</div><p class="eyebrow">训练总结</p><h1>${title}</h1><p class="subtle">${formatDate(new Date(session?.startedAt || Date.now()))} · ${session?.endedReason === 'discomfort' ? '因身体不适停止' : '本次会话已保存'}</p><div class="summary-stats"><div class="summary-stat"><strong>${progress.completed}/${progress.total}</strong><span>完成组数</span></div><div class="summary-stat"><strong>${formatTime(sessionEffectiveMs(session))}</strong><span>有效训练</span></div><div class="summary-stat"><strong>${formatTime(sessionRestMs(session))}</strong><span>休息时间</span></div></div><div class="summary-note">${note}<br/>训练内容属于辅助与记录工具，不代表医学判断或疗效承诺。</div></div><div class="summary-actions"><button class="primary-btn wide-btn" data-action="view-home">返回首页</button><button class="secondary-btn wide-btn" data-action="view-records">查看打卡记录</button></div></div></div>`;
}

function createSession() {
  const snapshot = clone(ensurePlanSnapshot());
  const sets = snapshot.actions.flatMap((action) => Array.from({ length: action.sets }, (_, setIndex) => ({ id: uid('set'), actionId: action.id, setIndex, status: 'pending', actualWorkMs: 0, restMs: 0 })));
  const now = Date.now();
  return { id: uid('session'), startedAt: now, startedDateKey: dateKey(new Date(now)), status: 'running', planSnapshot: snapshot, sets, exerciseIndex: 0, currentSetIndex: 0, phase: 'prepare', phaseStartedAt: now, phaseEndsAt: now + state.settings.prepSeconds * 1000, workStartedAt: null, pausedMs: 0, isPaused: false, pausedAt: null, endedAt: null, endedReason: null };
}
function startTraining() {
  if (state.dailyRecords[dateKey()]?.status === 'complete' && !state.activeSession) { ui.tab = 'records'; ui.selectedDate = dateKey(); render(); return; }
  if (!state.activeSession) state.activeSession = createSession();
  persist(); ui.screen = 'player'; render();
}
function ensureTick() { if (!tickHandle) tickHandle = window.setInterval(() => { if (ui.screen === 'player' && state.activeSession && !state.activeSession.isPaused) { advanceIfNeeded(); render(); } }, 250); }
function clearTick() { if (tickHandle) { clearInterval(tickHandle); tickHandle = null; } }
function advanceIfNeeded() {
  const session = state.activeSession; if (!session || session.isPaused) return;
  if (!['prepare', 'work', 'rest', 'transition'].includes(session.phase)) return;
  if (Date.now() < session.phaseEndsAt) return;
  if (session.phase === 'prepare') { beginWork(); return; }
  if (session.phase === 'work') { session.phase = 'confirm'; session.phaseEndedAt = Date.now(); notifyCue(); persist(); return; }
  if (session.phase === 'rest') { beginNextSet(); return; }
  if (session.phase === 'transition') { session.exerciseIndex += 1; session.currentSetIndex = 0; beginWork(); return; }
}
function beginWork() {
  const session = state.activeSession; const action = session.planSnapshot.actions[session.exerciseIndex]; const set = session.sets.find((item) => item.actionId === action.id && item.setIndex === session.currentSetIndex); if (!set || set.status !== 'pending') return;
  session.phase = 'work'; session.phaseStartedAt = Date.now(); session.phaseEndsAt = Date.now() + actionDuration(action) * 1000; session.workStartedAt = Date.now(); session.isPaused = false; notifyCue(); persist();
}
function beginNextSet() { const session = state.activeSession; const action = session.planSnapshot.actions[session.exerciseIndex]; session.currentSetIndex += 1; session.phase = 'work'; session.phaseStartedAt = Date.now(); session.phaseEndsAt = Date.now() + actionDuration(action) * 1000; session.workStartedAt = Date.now(); session.isPaused = false; notifyCue(); persist(); }
function beginTransition() { const session = state.activeSession; if (session.exerciseIndex >= session.planSnapshot.actions.length - 1) { finalizeSession('complete'); return; } session.phase = 'transition'; session.phaseStartedAt = Date.now(); session.phaseEndsAt = Date.now() + state.settings.transitionSeconds * 1000; session.isPaused = false; notifyCue(); persist(); }
function currentSet() { const session = state.activeSession; if (!session) return null; const action = session.planSnapshot.actions[session.exerciseIndex]; return session.sets.find((item) => item.actionId === action.id && item.setIndex === session.currentSetIndex); }
function completeSet() {
  const session = state.activeSession; if (!session || session.phase === 'confirm' || session.phase === 'work') { const set = currentSet(); if (!set || set.status !== 'pending') return; const elapsed = Math.min(actionDuration(session.planSnapshot.actions[session.exerciseIndex]) * 1000, Math.max(0, actionDuration(session.planSnapshot.actions[session.exerciseIndex]) * 1000 - Math.max(0, session.phaseEndsAt - (session.isPaused ? (session.pausedAt || Date.now()) : Date.now())))); set.status = 'completed'; set.actualWorkMs = elapsed; set.completedAt = Date.now(); session.phase = 'settling'; session.isPaused = true; const action = session.planSnapshot.actions[session.exerciseIndex]; if (session.currentSetIndex < action.sets - 1) { session.phase = 'rest'; session.phaseStartedAt = Date.now(); session.phaseEndsAt = Date.now() + action.rest * 1000; session.isPaused = false; set.restMs = action.rest * 1000; } else beginTransition(); persist(); maybeVibrate(); render(); }
}
function skipSet() {
  const session = state.activeSession; const set = currentSet(); if (!session || !set || set.status !== 'pending') return; set.status = 'skipped'; set.skippedAt = Date.now(); const action = session.planSnapshot.actions[session.exerciseIndex]; if (session.currentSetIndex < action.sets - 1) { beginNextSet(); } else beginTransition(); persist(); render();
}
function skipExercise() {
  const session = state.activeSession; if (!session) return; const action = session.planSnapshot.actions[session.exerciseIndex]; session.sets.filter((set) => set.actionId === action.id && set.status === 'pending').forEach((set) => { set.status = 'skipped'; set.skippedAt = Date.now(); }); beginTransition(); persist(); render();
}
function pauseSession(auto = false) {
  const session = state.activeSession; if (!session || session.isPaused) return; if (!['prepare', 'work', 'rest', 'transition'].includes(session.phase)) return; session.isPaused = true; session.pausedAt = Date.now(); session.pausedByVisibility = auto; persist(); render();
}
function resumeSession(shouldRender = true) {
  const session = state.activeSession; if (!session || !session.isPaused) return; const now = Date.now(); const pausedFor = session.pausedAt ? Math.max(0, now - session.pausedAt) : 0; session.pausedMs += pausedFor; if (session.phaseEndsAt) session.phaseEndsAt += pausedFor; session.phaseStartedAt = now; session.pausedAt = null; session.isPaused = false; session.pausedByVisibility = false; persist(); if (shouldRender) render();
}
function skipRest() { const session = state.activeSession; if (!session) return; if (session.isPaused) resumeSession(false); if (session.phase === 'rest') beginNextSet(); else if (session.phase === 'transition') { session.exerciseIndex += 1; session.currentSetIndex = 0; beginWork(); } render(); }
function extendRest() { const session = state.activeSession; if (!session || !['rest', 'transition'].includes(session.phase)) return; if (session.isPaused) resumeSession(false); session.phaseEndsAt += 15000; maybeVibrate(); persist(); render(); }
function finalizeSession(reason = 'partial') {
  const session = state.activeSession; if (!session || session.status !== 'running') return; session.status = reason === 'complete' ? 'complete' : activeSessionProgress(session).completed ? 'partial' : 'no-record'; session.endedReason = session.endedReason || reason; session.endedAt = Date.now(); session.isPaused = true; session.pausedAt = null; state.sessions.push(clone(session)); state.activeSession = null; persist(); clearTick(); ui.summary = session; ui.screen = 'summary'; render();
}
function stopTraining(reason = 'ended-early') { const session = state.activeSession; if (!session) return; if (session.isPaused === false) { session.isPaused = true; session.pausedAt = null; } session.endedReason = reason; finalizeSession('partial'); }
function notifyCue() { if (state.settings.sound && 'speechSynthesis' in window) { window.speechSynthesis.cancel(); const phrase = state.activeSession?.phase === 'rest' ? '休息' : state.activeSession?.phase === 'transition' ? '动作切换' : '开始'; const utterance = new SpeechSynthesisUtterance(phrase); utterance.lang = 'zh-CN'; utterance.rate = 1.05; utterance.volume = .35; window.speechSynthesis.speak(utterance); } maybeVibrate(); }
function maybeVibrate() { if (state.settings.vibration && navigator.vibrate) navigator.vibrate(35); }

function handleAction(action, element) {
  if (action === 'tab') { if (element.dataset.tab === 'home') ui.homeCopy = nextHomeCopy(); ui.tab = element.dataset.tab; ui.modal = null; render(); return; }
  if (action === 'onboard-next') { if (ui.onboardingStep === 0) ui.onboardingStep = 1; else if (ui.onboardingStep < 5) ui.onboardingStep += 1; else { state.preferences = clone(ui.onboardingDraft); state.activePlan = { id: '7', name: '7天训练体验计划', startDate: dateKey(), paused: false }; state.planSnapshot = createPlanSnapshot(); state.reminder.enabled = false; persist(); ui.screen = 'main'; ui.tab = 'home'; } render(); return; }
  if (action === 'onboard-back') { ui.onboardingStep = Math.max(0, ui.onboardingStep - 1); render(); return; }
  if (action === 'onboard-choice') { ui.onboardingDraft[element.dataset.field] = element.dataset.field === 'minutes' ? Number(element.dataset.value) : element.dataset.value; render(); return; }
  if (action === 'onboard-toggle') { const field = element.dataset.field; ui.onboardingDraft[field] = !ui.onboardingDraft[field]; render(); return; }
  if (action === 'start-training') { startTraining(); return; }
  if (action === 'open-action') { ui.modal = { type: 'action', id: element.dataset.id }; render(); return; }
  if (action === 'close-modal') { if (element.hasAttribute('data-modal-content') && element !== element.closest('.modal-backdrop')) return; ui.modal = null; render(); return; }
  if (action === 'add-to-plan') { const id = element.dataset.id; if (!state.planSnapshot.actions.some((item) => item.id === id)) state.planSnapshot.actions.push(clone(getAction(id))); persist(); ui.modal = null; render(); toast('已加入今日计划'); return; }
  if (action === 'edit-action') { ui.modal = { type: 'action', id: element.dataset.id, editing: true, draft: clone(getAction(element.dataset.id)) }; render(); return; }
  if (action === 'cancel-edit') { ui.modal = { type: 'action', id: ui.modal.id }; render(); return; }
  if (action === 'save-action') { const id = element.dataset.id; const draft = ui.modal?.draft; const target = getAction(id); if (target && draft) { target.sets = Math.max(1, Math.min(8, Number(draft.sets) || target.sets)); target.reps = target.mode === 'hold' ? 0 : Math.max(1, Math.min(120, Number(draft.reps) || target.reps)); target.holdSeconds = target.mode === 'hold' ? Math.max(1, Math.min(600, Number(draft.holdSeconds) || target.holdSeconds)) : 0; target.tempo = Math.max(1, Math.min(10, Number(draft.tempo) || target.tempo)); target.rest = Math.max(0, Math.min(180, Number(draft.rest) || target.rest)); if (!state.activeSession && state.planSnapshot) { const planned = state.planSnapshot.actions.find((item) => item.id === id); if (planned) Object.assign(planned, clone(target)); } persist(); ui.modal = null; render(); toast('参数已保存，后续计划会使用新设置'); } return; }
  if (action === 'open-plan') { ui.modal = { type: 'plan' }; render(); return; }
  if (action === 'choose-plan') { const id = element.dataset.id; state.activePlan = { id, name: id === '30' ? '30天训练习惯计划' : '7天训练体验计划', startDate: dateKey(), paused: false }; persist(); ui.modal = null; render(); toast(`已切换到${state.activePlan.name}`); return; }
  if (action === 'open-about' || action === 'show-about') { ui.modal = { type: 'about' }; render(); return; }
  if (action === 'pause-session') { if (state.activeSession?.isPaused) resumeSession(); else pauseSession(); return; }
  if (action === 'resume-session') { resumeSession(); return; }
  if (action === 'complete-set') { completeSet(); return; }
  if (action === 'skip-set') { skipSet(); return; }
  if (action === 'skip-exercise') { skipExercise(); return; }
  if (action === 'skip-rest') { skipRest(); return; }
  if (action === 'extend-rest') { extendRest(); return; }
  if (action === 'end-training') { ui.modal = { type: 'confirm', kind: 'end' }; render(); return; }
  if (action === 'stop-discomfort') { ui.modal = { type: 'confirm', kind: 'discomfort' }; render(); return; }
  if (action === 'confirm-end') { ui.modal = null; stopTraining(); return; }
  if (action === 'confirm-discomfort') { ui.modal = null; stopTraining('discomfort'); return; }
  if (action === 'view-home') { ui.homeCopy = nextHomeCopy(); ui.screen = 'main'; ui.tab = 'home'; ui.summary = null; render(); return; }
  if (action === 'view-records') { ui.screen = 'main'; ui.tab = 'records'; ui.summary = null; render(); return; }
  if (action === 'library-filter') { ui.filter = element.dataset.value; render(); return; }
  if (action === 'calendar-prev') { ui.calendarDate = new Date(ui.calendarDate.getFullYear(), ui.calendarDate.getMonth() - 1, 1); render(); return; }
  if (action === 'calendar-next') { ui.calendarDate = new Date(ui.calendarDate.getFullYear(), ui.calendarDate.getMonth() + 1, 1); render(); return; }
  if (action === 'select-date') { ui.selectedDate = element.dataset.date; render(); return; }
  if (action === 'manual-record') { const minutes = Number(window.prompt('这次训练大约几分钟？将单独标记为“手动记录”。', '10')); if (Number.isFinite(minutes) && minutes > 0) { state.manualRecords.push({ id: uid('manual'), date: dateKey(), minutes: Math.round(minutes), createdAt: Date.now(), label: '手动记录' }); persist(); render(); toast('已保存手动记录'); } return; }
  if (action === 'mark-rest') { const today = dateKey(); if (!state.restDays.includes(today)) state.restDays.push(today); persist(); render(); toast('今天已标记为休息日'); return; }
  if (action === 'export-data') { exportData(); return; }
  if (action === 'import-data') { document.getElementById('import-file').click(); return; }
  if (action === 'clear-data') { ui.modal = { type: 'confirm', kind: 'clear' }; render(); return; }
  if (action === 'confirm-clear') { localStorage.removeItem(STORAGE_KEY); state = makeDefaultState(); ui = { ...ui, screen: 'onboarding', tab: 'home', onboardingStep: 0, onboardingDraft: clone(state.preferences || ui.onboardingDraft), modal: null }; render(); return; }
}

function handleChange(event) {
  const field = event.target.dataset.field; const setting = event.target.dataset.setting;
  if (field === 'library-query') { ui.query = event.target.value; render(); return; }
  if (!setting) return;
  if (setting === 'reminderEnabled') {
    if (event.target.checked && 'Notification' in window) { Notification.requestPermission().then((permission) => { state.reminder.permission = permission; state.reminder.enabled = permission === 'granted'; persist(); render(); }); } else { state.reminder.enabled = false; persist(); render(); }
    return;
  }
  if (setting === 'reminderTime') state.reminder.time = event.target.value;
  else if (['prepSeconds', 'transitionSeconds'].includes(setting)) state.settings[setting] = Math.max(0, Math.min(90, Number(event.target.value) || 0));
  else state.settings[setting] = event.target.checked;
  persist(); render();
}

function exportData() { const payload = { ...state, exportedAt: new Date().toISOString(), exportVersion: APP_VERSION }; const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' }); const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.href = url; link.download = `不许奓毛-本地数据-${dateKey()}.json`; link.click(); URL.revokeObjectURL(url); toast('数据已导出'); }
function importData(file) { const reader = new FileReader(); reader.onload = () => { try { const parsed = JSON.parse(reader.result); if (!parsed || !Array.isArray(parsed.sessions) || !Array.isArray(parsed.actions)) throw new Error('invalid'); state = migrateState(parsed); persist(); ui.screen = state.preferences ? 'main' : 'onboarding'; ui.tab = 'home'; render(); toast('数据已导入'); } catch { window.alert('导入失败：文件格式不符合本应用的数据结构。'); } }; reader.readAsText(file); }
function toast(message) { ui.toast = message; window.clearTimeout(toast.timer); toast.timer = window.setTimeout(() => { ui.toast = ''; render(); }, 1900); render(); }

document.getElementById('app').addEventListener('click', (event) => { if (event.target.closest('a.video-action-link, a.video-detail-link, a.player-video-link')) return; const target = event.target.closest('[data-action]'); if (!target) return; if (target.dataset.action === 'close-modal' && target.classList.contains('modal-backdrop') && event.target !== target) return; handleAction(target.dataset.action, target); });
document.getElementById('app').addEventListener('change', handleChange);
document.getElementById('app').addEventListener('input', (event) => { if (event.target.dataset.field === 'library-query') { ui.query = event.target.value; render(); } if (event.target.dataset.editField && ui.modal?.type === 'action') { const field = event.target.dataset.editField; ui.modal.draft = { ...(ui.modal.draft || {}), [field]: Number(event.target.value) }; } });
document.getElementById('import-file').addEventListener('change', (event) => { if (event.target.files?.[0]) importData(event.target.files[0]); event.target.value = ''; });
document.addEventListener('visibilitychange', () => { if (document.hidden && ui.screen === 'player' && state.activeSession && !state.activeSession.isPaused) pauseSession(true); });
window.addEventListener('beforeunload', () => { if (state.activeSession && !state.activeSession.isPaused) pauseSession(true); persist(); });
if ('serviceWorker' in navigator) window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(() => {}));

render();
