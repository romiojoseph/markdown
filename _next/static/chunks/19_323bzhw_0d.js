(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,89086,e=>{e.v({container:"ToastHost-module__GLtl8a__container",toast:"ToastHost-module__GLtl8a__toast"})},18810,e=>{"use strict";var t=e.i(18050),r=e.i(55851),n=e.i(89086);e.s(["default",0,function(){let{toasts:e}=(0,r.useUI)();return e&&0!==e.length?(0,t.jsx)("div",{className:n.default.container,"aria-live":"polite","aria-atomic":"true",children:e.map(e=>(0,t.jsx)("div",{className:`${n.default.toast} ${n.default[e.type]||""}`,children:e.message},e.id))}):null}])},14333,49346,57437,e=>{"use strict";let t;var r=e.i(18050),n=e.i(71645);function o(e){return new Promise((t,r)=>{e.oncomplete=e.onsuccess=()=>t(e.result),e.onabort=e.onerror=()=>r(e.error)})}function a(){var e;let r;return t||(e="keyval",t=(t,n)=>(()=>{if(r)return r;let t=indexedDB.open("keyval-store");return t.onupgradeneeded=()=>t.result.createObjectStore(e),(r=o(t)).then(e=>{e.onclose=()=>r=void 0},()=>{r=void 0}),r})().then(r=>n(r.transaction(e,t).objectStore(e)))),t}function l(e,t=a()){return t("readonly",t=>o(t.get(e)))}function i(e,t,r=a()){return r("readwrite",r=>(r.put(t,e),o(r.transaction)))}function d(e,t=a()){return t("readwrite",t=>(t.delete(e),o(t.transaction)))}let u="md_docs",s="md_folders",c="md_active_doc",f="Untitled",m="New Folder",p=[{id:"folder-main",name:"Documentation",parentId:null},{id:"folder-ai-core",name:"AI Core",parentId:"folder-main"},{id:"folder-ai-interaction",name:"AI Interaction",parentId:"folder-main"},{id:"folder-ai-rules",name:"AI Guidelines",parentId:"folder-main"},{id:"folder-dev-core",name:"Developer Guide",parentId:"folder-main"}],h=[{id:"doc-agents",name:"AGENTS.md",folderId:"folder-ai-core",content:`# AGENTS.md

## Project
[One sentence: what this is and what stack it uses.]

## Commands
- Install: \`[command]\`
- Dev: \`[command]\`
- Build: \`[command]\`
- Test: \`[command]\`
- Lint: \`[command]\`

## Conventions
- [Only include things an agent cannot infer from the codebase]
- Example: "Use pnpm, not npm"
- Example: "All API routes live in /src/api/ and follow REST conventions"

## Rules
- [Non-negotiable behaviours for the agent]
- Example: "Never modify migration files"
- Example: "Do not install new dependencies without confirmation"

## Tools
| Tool | Purpose | Notes |
| --- | --- | --- |
| [Tool name] | [What it does] | [Auth method, limits] |

## Off-limits
- [Files, folders, or actions the agent must never touch]
`,createdAt:0,updatedAt:0},{id:"doc-system",name:"SYSTEM.md",folderId:"folder-ai-core",content:`# SYSTEM.md

## Mission
[What this system or assistant is fundamentally trying to do.]

## Boundaries
- Never provide: [prohibited content or actions]
- Always protect: [sensitive information or data]

## Style
- Voice: [concise / friendly / professional]
- Tone: [confident / cautious / neutral]
- Format: [markdown / plain text / JSON]

## Safety
- Refuse unsafe or out-of-scope requests with a brief explanation
- Offer a safe alternative where possible

## Reliability
- Admit uncertainty explicitly
- Ask clarifying questions when the request is ambiguous
- Do not invent sources, data, or references

## Output rules
- Follow the requested format exactly
- Include citations only when asked
- Keep responses scoped to the task
`,createdAt:0,updatedAt:0},{id:"doc-skill",name:"SKILL.md",folderId:"folder-ai-core",content:`# SKILL.md

## Purpose
[What task this skill handles and what outcome it produces.]

## When to use
- Use when: [conditions or trigger phrases]
- Skip when: [exclusions or better alternatives]

## Inputs
- Required: [what the user must provide]
- Optional: [what improves quality if provided]

## Output
- [Primary artifact: what this skill produces]
- [Secondary artifacts: optional extras]

## Steps
1. Confirm inputs and clarify ambiguities
2. [Step]
3. [Step]
4. Validate output against acceptance criteria

## Done when
- Output is complete and actionable
- No placeholder text remains
- [Domain-specific criterion]
`,createdAt:0,updatedAt:0},{id:"doc-instructions",name:"INSTRUCTIONS.md",folderId:"folder-ai-interaction",content:`# INSTRUCTIONS.md

## Objective
[Single sentence: what must be accomplished.]

## Inputs
- [File, link, dataset, or reference provided]

## Output required
- [Exactly what must be delivered and in what format]

## Constraints
- [Time, format, tools, or policy constraints]

## Steps
1. [Step]
2. [Step]
3. [Step]

## Done when
- [Criterion 1]
- [Criterion 2]

## Notes
- [Assumptions, edge cases, or special handling]
`,createdAt:0,updatedAt:0},{id:"doc-persona",name:"PERSONA.md",folderId:"folder-ai-interaction",content:`# PERSONA.md

## Name
[Persona name]

## Mission
[One sentence: how this persona helps the user.]

## Traits
- [Trait 1]
- [Trait 2]
- [Trait 3]

## Voice and tone
- Voice: [clear / direct / warm]
- Tone: [calm / optimistic / pragmatic]

## Do
- [Behaviour to emphasise]
- [Behaviour to emphasise]

## Avoid
- [Behaviour to suppress]
- [Behaviour to suppress]
`,createdAt:0,updatedAt:0},{id:"doc-context",name:"CONTEXT.md",folderId:"folder-ai-interaction",content:`# CONTEXT.md

## Product
- Name: [name]
- Problem solved: [problem]
- Primary users: [audience]
- Platform: [web / mobile / desktop]

## Current state
- Working: [what exists today]
- Gaps: [what is missing or broken]

## Constraints
- Data sources: [local / API / files]
- Compliance: [if any]

## Success metrics
- [Metric 1]
- [Metric 2]

## Glossary
- [Term]: [definition]
`,createdAt:0,updatedAt:0},{id:"doc-memory",name:"MEMORY.md",folderId:"folder-ai-interaction",content:`# MEMORY.md

## Decisions
| Decision | Reason | Date |
| --- | --- | --- |
| [Summary] | [Why it was chosen] | [Date] |

## Preferences
- Output format: [markdown / JSON / plain text]
- Writing style: [short / formal / bulleted]

## Revisit
- [Topic or decision]: revisit by [date]
`,createdAt:0,updatedAt:0},{id:"doc-workflow",name:"WORKFLOW.md",folderId:"folder-ai-rules",content:`# WORKFLOW.md

## Phases
1. Discover — clarify requirements and constraints
2. Plan — outline approach and identify risks
3. Execute — implement with checkpoints
4. Review — verify correctness and edge cases
5. Deliver — hand off with documentation

## Checkpoints
- Requirements confirmed before starting
- Risks identified before executing
- Output validated before delivering

## Definition of done
- All deliverables complete
- Acceptance criteria met
- Next steps documented

## Rollback plan
- Identify the last stable state
- Document steps to restore it
`,createdAt:0,updatedAt:0},{id:"doc-rules",name:"RULES.md",folderId:"folder-ai-rules",content:`# RULES.md

## Non-negotiable
- Follow the requested output format exactly
- Do not fabricate sources, data, or references
- State uncertainty explicitly — do not guess silently
- Never share sensitive or private information
- Prefer minimal, reversible changes over sweeping ones
- Ask before acting on ambiguous instructions

## Scope
- Stay within the task as defined
- Flag out-of-scope requests rather than silently ignoring them

## On errors
- Acknowledge mistakes clearly
- Correct and continue — do not repeat the error
`,createdAt:0,updatedAt:0},{id:"doc-architecture",name:"ARCHITECTURE.md",folderId:"folder-dev-core",content:`# ARCHITECTURE.md

## Overview
[One paragraph: what this system does, for whom, and on what platform.]

## Components
- [Component]: [what it does]
- [Component]: [what it does]

## Data flow
[2–4 sentences describing how data moves through the system.]

## Key decisions
- [Decision]: [why, not how]
- [Decision]: [why, not how]

## Known limits
- [Limit or risk]
`,createdAt:0,updatedAt:0},{id:"doc-roadmap",name:"ROADMAP.md",folderId:"folder-dev-core",content:`# ROADMAP.md

## Now
- [ ] [Task]
- [ ] [Task]

## Next
- [ ] [Task]
- [ ] [Task]

## Later
- [ ] [Task]

## Blocked by
- [Dependency or risk]
`,createdAt:0,updatedAt:0},{id:"doc-setup",name:"SETUP.md",folderId:"folder-dev-core",content:`# SETUP.md

## Prerequisites
- [Runtime or tool] [version]
- [Runtime or tool] [version]

## Install
\`\`\`
[install command]
\`\`\`

## Run locally
\`\`\`
[dev command]
\`\`\`

Open [http://localhost:3000](http://localhost:3000)

## Build and deploy
\`\`\`
[build command]
[deploy command]
\`\`\`

## Troubleshooting
- [Common issue]: [fix]
`,createdAt:0,updatedAt:0},{id:"doc-api",name:"API.md",folderId:"folder-dev-core",content:`# API.md

## Schema
### [Type name]
- \`field\`: type — [note if non-obvious]

### [Type name]
- \`field\`: type — [note if non-obvious]

## Storage keys
- \`[key]\`: [what it holds]

## Usage examples
- Create: \`[example]\`
- Read: \`[example]\`
- Update: \`[example]\`
- Delete: \`[example]\`
`,createdAt:0,updatedAt:0},{id:"doc-security",name:"SECURITY.md",folderId:"folder-dev-core",content:`# SECURITY.md

## Scope
- Data lives: [browser localStorage / server / cloud]
- Server-side storage: [yes / no]

## Reporting a vulnerability
- Contact: [email or method]
- Expected response time: [time]

## Threat model
- [What data is at risk and how]
- [Known attack surface]

## Privacy
- Analytics: [none / what is collected]
- External data sharing: [none / what and why]
`,createdAt:0,updatedAt:0}];e.s(["DEBOUNCE_MS",0,500,"DEFAULT_DOCS",0,h,"DEFAULT_FOLDERS",0,p,"EDITOR_MAX_WIDTH",0,"720px","UNTITLED_DOC",0,f,"UNTITLED_FOLDER",0,m],49346);let y="markdown_seeded";async function v(e,t){try{let t=await l(e);if(t)return t}catch(e){console.warn("IDB read failed, falling back to localStorage",e)}let r=localStorage.getItem(e);try{return r?JSON.parse(r):t}catch(e){if(r&&"string"==typeof t)return r;return t}}async function g(e,t){try{await i(e,t)}catch(e){console.warn("IDB write failed",e)}try{localStorage.setItem(e,"string"==typeof t?t:JSON.stringify(t))}catch(e){console.error("LocalStorage write failed",e)}}async function b(){return v(u,[])}async function P(e){return g(u,e)}async function S(){return v(s,[])}async function _(e){return g(s,e)}async function O(){try{let e=await l(c);if(e)return e}catch(e){}return localStorage.getItem(c)}async function w(e){if(e){try{await i(c,e)}catch(e){}localStorage.setItem(c,e)}else{try{await d(c)}catch(e){}localStorage.removeItem(c)}}async function x(){localStorage.getItem(y)||(await _(p),await P(h),localStorage.setItem(y,"true"))}async function T(){for(let e of[u,s,c,y]){try{await d(e)}catch(e){}try{localStorage.removeItem(e)}catch(e){}}}function j(){if("u">typeof crypto){if("function"==typeof crypto.randomUUID)return crypto.randomUUID();if("function"==typeof crypto.getRandomValues){let e=new Uint8Array(16);crypto.getRandomValues(e),e[6]=15&e[6]|64,e[8]=63&e[8]|128;let t=[...e].map(e=>e.toString(16).padStart(2,"0")).join("");return`${t.slice(0,8)}-${t.slice(8,12)}-${t.slice(12,16)}-${t.slice(16,20)}-${t.slice(20)}`}}return`id-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,11)}`}e.s(["loadActiveDoc",0,O,"loadDocs",0,b,"loadFolders",0,S,"resetAppStorage",0,T,"saveActiveDoc",0,w,"saveDocs",0,P,"saveFolders",0,_,"seedIfEmpty",0,x],57437);let C=(0,n.createContext)();e.s(["DocsProvider",0,function({children:e}){let[t,o]=(0,n.useState)([]),[a,l]=(0,n.useState)([]),[i,d]=(0,n.useState)(null),[u,s]=(0,n.useState)(!1);(0,n.useEffect)(()=>{!async function(){await x();let[e,t,r]=await Promise.all([b(),S(),O()]);o(e),l(t),d(r||(e.length>0?e[0].id:null)),s(!0)}()},[]),(0,n.useEffect)(()=>{u&&P(t)},[t,u]),(0,n.useEffect)(()=>{u&&_(a)},[a,u]),(0,n.useEffect)(()=>{u&&w(i)},[i,u]);let c=(e,t)=>{o(r=>r.map(r=>r.id===e?{...r,...t,updatedAt:Date.now()}:r))};return(0,r.jsx)(C.Provider,{value:{docs:t,folders:a,activeDocId:i,isMounted:u,createDoc:(e=null)=>{let t={id:j(),name:f,folderId:e,content:"",createdAt:Date.now(),updatedAt:Date.now()};return o(e=>[...e,t]),d(t.id),t},updateDoc:c,deleteDoc:e=>{o(t=>t.filter(t=>t.id!==e)),i===e&&d(null)},renameDoc:(e,t)=>c(e,{name:t}),moveDoc:(e,t)=>c(e,{folderId:t}),duplicateDoc:e=>{let r=t.find(t=>t.id===e);if(!r)return null;let n={...r,id:j(),name:`${r.name} (Copy)`,createdAt:Date.now(),updatedAt:Date.now()};return o(e=>[...e,n]),d(n.id),n},createFolder:(e=m)=>{let t={id:j(),name:e,parentId:null};return l(e=>[...e,t]),t},createFolderIn:(e=null,t=m)=>{let r={id:j(),name:t,parentId:e};return l(e=>[...e,r]),r},renameFolder:(e,t)=>{l(r=>r.map(r=>r.id===e?{...r,name:t}:r))},deleteFolder:(e,t=!1)=>{if(t){let t=(e,r)=>{let n=r.filter(t=>t.parentId===e),o=[...n];return n.forEach(e=>{o=[...o,...t(e.id,r)]}),o},r=t(e,a),n=new Set([e,...r.map(e=>e.id)]);l(e=>e.filter(e=>!n.has(e.id))),o(e=>{let t=e.filter(e=>!n.has(e.folderId));return i&&!t.some(e=>e.id===i)&&d(null),t})}else l(t=>t.filter(t=>t.id!==e).map(t=>t.parentId===e?{...t,parentId:null}:t)),o(t=>t.map(t=>t.folderId===e?{...t,folderId:null}:t))},moveFolder:(e,t)=>{l(r=>{let n=new Map(r.map(e=>[e.id,e]));return e===t||((e,t)=>{let r=n.get(e),o=new Set;for(;r&&r.parentId&&!o.has(r.id);){if(o.add(r.id),r.parentId===t)return!0;r=n.get(r.parentId)}return!1})(t,e)?r:r.map(r=>r.id===e?{...r,parentId:t}:r)})},setActiveDocId:d,importDocs:e=>{let t=e.map(e=>({id:j(),name:e.name||f,folderId:e.folderId||null,content:e.content||"",createdAt:Date.now(),updatedAt:Date.now()}));return o(e=>[...e,...t]),t.length>0&&d(t[0].id),t}},children:e})},"useDocs",0,()=>(0,n.useContext)(C)],14333)},55851,e=>{"use strict";var t=e.i(18050),r=e.i(71645);let n=(0,r.createContext)();e.s(["UIProvider",0,function({children:e}){let[o,a]=(0,r.useState)("edit"),[l,i]=(0,r.useState)(!0),[d,u]=(0,r.useState)(!0),[s,c]=(0,r.useState)(null),[f,m]=(0,r.useState)(null),[p,h]=(0,r.useState)(null),[y,v]=(0,r.useState)([]),g=(0,r.useRef)(0),[b,P]=(0,r.useState)([]),[S,_]=(0,r.useState)(new Set);return(0,r.useEffect)(()=>{let e=()=>{window.innerWidth<768&&("split"===o&&a("preview"),i(!1),u(!1))};return e(),window.addEventListener("resize",e),()=>window.removeEventListener("resize",e)},[o]),(0,t.jsx)(n.Provider,{value:{mode:o,setMode:a,sidebarOpen:l,toggleSidebar:()=>i(e=>!e),closeSidebar:()=>i(!1),toolbarOpen:d,toggleToolbar:()=>u(e=>!e),closeToolbar:()=>u(!1),activeModal:s,modalTarget:f,openModal:(e,t=null)=>{c(e),m(t)},closeModal:()=>{c(null),m(null)},selectionStats:p,setSelectionStats:h,toasts:y,pushToast:(e,t="info",r=2400)=>{let n=`toast-${g.current++}`;v(r=>[...r,{id:n,message:e,type:t}]),window.setTimeout(()=>{v(e=>e.filter(e=>e.id!==n))},r)},selectedIds:b,setSelectedIds:P,openFolderIds:S,toggleFolder:e=>{_(t=>{let r=new Set(t);return r.has(e)?r.delete(e):r.add(e),r})}},children:e})},"useUI",0,()=>(0,r.useContext)(n)])},28298,(e,t,r)=>{"use strict";e.i(47167),Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"useRouterBFCache",{enumerable:!0,get:function(){return o}});let n=e.r(71645);function o(e,t,r){let[o,a]=(0,n.useState)(()=>({tree:e,cacheNode:t,stateKey:r,next:null}));if(o.tree===e)return o;let l={tree:e,cacheNode:t,stateKey:r,next:null},i=1,d=o,u=l;for(;null!==d&&i<1;){if(d.stateKey===r){u.next=d.next;break}{i++;let e={tree:d.tree,cacheNode:d.cacheNode,stateKey:d.stateKey,next:null};u.next=e,u=e}d=d.next}return a(l),l}("function"==typeof r.default||"object"==typeof r.default&&null!==r.default)&&void 0===r.default.__esModule&&(Object.defineProperty(r.default,"__esModule",{value:!0}),Object.assign(r.default,r),t.exports=r.default)},47257,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"ClientPageRoot",{enumerable:!0,get:function(){return u}});let n=e.r(18050),o=e.r(8372),a=e.r(71645),l=e.r(33906),i=e.r(61994),d=e.r(15783);function u({Component:e,serverProvidedParams:t}){let r,s;if(null!==t)r=t.searchParams,s=t.params;else{let e=(0,a.use)(o.LayoutRouterContext);s=null!==e?e.parentParams:{},r=(0,l.urlSearchParamsToParsedUrlQuery)((0,a.use)(i.SearchParamsContext))}let c=(0,d.createClientSearchParams)(r),f=(0,d.createClientParams)(s);return(0,n.jsx)(e,{params:f,searchParams:c})}("function"==typeof r.default||"object"==typeof r.default&&null!==r.default)&&void 0===r.default.__esModule&&(Object.defineProperty(r.default,"__esModule",{value:!0}),Object.assign(r.default,r),t.exports=r.default)},92825,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"ClientSegmentRoot",{enumerable:!0,get:function(){return i}});let n=e.r(18050),o=e.r(8372),a=e.r(71645),l=e.r(15783);function i({Component:e,slots:t,serverProvidedParams:r}){let d;if(null!==r)d=r.params;else{let e=(0,a.use)(o.LayoutRouterContext);d=null!==e?e.parentParams:{}}let u=(0,l.createClientParams)(d);return(0,n.jsx)(e,{...t,params:u})}("function"==typeof r.default||"object"==typeof r.default&&null!==r.default)&&void 0===r.default.__esModule&&(Object.defineProperty(r.default,"__esModule",{value:!0}),Object.assign(r.default,r),t.exports=r.default)},68017,(e,t,r)=>{"use strict";e.i(47167),Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"HTTPAccessFallbackBoundary",{enumerable:!0,get:function(){return s}});let n=e.r(90809),o=e.r(18050),a=n._(e.r(71645)),l=e.r(90373),i=e.r(54394),d=e.r(8372);class u extends a.default.Component{constructor(e){super(e),this.state={triggeredStatus:void 0,previousPathname:e.pathname}}componentDidCatch(){}static getDerivedStateFromError(e){if((0,i.isHTTPAccessFallbackError)(e))return{triggeredStatus:(0,i.getAccessFallbackHTTPStatus)(e)};throw e}static getDerivedStateFromProps(e,t){return e.pathname!==t.previousPathname&&t.triggeredStatus?{triggeredStatus:void 0,previousPathname:e.pathname}:{triggeredStatus:t.triggeredStatus,previousPathname:e.pathname}}render(){let{notFound:e,forbidden:t,unauthorized:r,children:n}=this.props,{triggeredStatus:a}=this.state,l={[i.HTTPAccessErrorStatus.NOT_FOUND]:e,[i.HTTPAccessErrorStatus.FORBIDDEN]:t,[i.HTTPAccessErrorStatus.UNAUTHORIZED]:r};if(a){let d=a===i.HTTPAccessErrorStatus.NOT_FOUND&&e,u=a===i.HTTPAccessErrorStatus.FORBIDDEN&&t,s=a===i.HTTPAccessErrorStatus.UNAUTHORIZED&&r;return d||u||s?(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)("meta",{name:"robots",content:"noindex"}),!1,l[a]]}):n}return n}}function s({notFound:e,forbidden:t,unauthorized:r,children:n}){let i=(0,l.useUntrackedPathname)(),c=(0,a.useContext)(d.MissingSlotContext);return e||t||r?(0,o.jsx)(u,{pathname:i,notFound:e,forbidden:t,unauthorized:r,missingSlots:c,children:n}):(0,o.jsx)(o.Fragment,{children:n})}("function"==typeof r.default||"object"==typeof r.default&&null!==r.default)&&void 0===r.default.__esModule&&(Object.defineProperty(r.default,"__esModule",{value:!0}),Object.assign(r.default,r),t.exports=r.default)},22976,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0});var n={InstantValidationBoundaryContext:function(){return a},PlaceValidationBoundaryBelowThisLevel:function(){return l},RenderValidationBoundaryAtThisLevel:function(){return i},SlotMarker:function(){return d}};for(var o in n)Object.defineProperty(r,o,{enumerable:!0,get:n[o]});let a=null,l=null,i=null,d=null;("function"==typeof r.default||"object"==typeof r.default&&null!==r.default)&&void 0===r.default.__esModule&&(Object.defineProperty(r.default,"__esModule",{value:!0}),Object.assign(r.default,r),t.exports=r.default)},77694,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0});var n={InstantValidationBoundaryContext:function(){return a.InstantValidationBoundaryContext},PlaceValidationBoundaryBelowThisLevel:function(){return a.PlaceValidationBoundaryBelowThisLevel},RenderValidationBoundaryAtThisLevel:function(){return a.RenderValidationBoundaryAtThisLevel},SlotMarker:function(){return a.SlotMarker}};for(var o in n)Object.defineProperty(r,o,{enumerable:!0,get:n[o]});let a=e.r(22976);("function"==typeof r.default||"object"==typeof r.default&&null!==r.default)&&void 0===r.default.__esModule&&(Object.defineProperty(r.default,"__esModule",{value:!0}),Object.assign(r.default,r),t.exports=r.default)},22042,(e,t,r)=>{"use strict";e.i(47167),Object.defineProperty(r,"__esModule",{value:!0});var n={LoadingBoundaryProvider:function(){return x},default:function(){return j}};for(var o in n)Object.defineProperty(r,o,{enumerable:!0,get:n[o]});let a=e.r(55682),l=e.r(90809),i=e.r(18050),d=l._(e.r(71645)),u=a._(e.r(74080)),s=e.r(8372),c=e.r(1244),f=e.r(72383),m=e.r(91915),p=e.r(58442),h=e.r(68017);e.r(77694);let y=e.r(70725),v=e.r(28298);e.r(74180);let g=e.r(61994),b=e.r(33906),P=e.r(95871);u.default.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;function S(e,t,r){let n=e.getClientRects();if(0===n.length)return 0;let o=1/0;for(let e=0;e<n.length;e++){let t=n[e];t.top<o&&(o=t.top)}return o>=r()&&o<=t?1:2}d.default.Component;let _=function(e){let t=d.default.useRef(null);return(0,d.useLayoutEffect)(()=>{let{focusAndScrollRef:r,cacheNode:n}=e,o=r.forceScroll?r.scrollRef:n.scrollRef;if(null===o||!o.current)return;let a=null,l=r.hashFragment;if(l){var i;if(null===(a="top"===(i=l)?document.body:document.getElementById(i)??document.getElementsByName(i)[0]??null)){o.current=!1,r.onlyHashChange=!1,r.hashFragment=null;return}}else a=t.current;if(null===a)return;let d=!1;(0,m.disableSmoothScrollDuringRouteTransition)(()=>{let e=document.documentElement,t=null,r=null,n=null,i=()=>{var r,o;let a,l;return null===n&&(r=e,o=t,n=!Number.isFinite(l=Number.parseFloat(a=getComputedStyle(r).scrollPaddingTop))||l<0?0:a.endsWith("px")?l:a.endsWith("%")?l/100*o:0),n};(l||(t=e.clientHeight,0!==(r=S(a,t,i))))&&((d=!0,o.current=!1,l)?a.scrollIntoView():1!==r&&(e.scrollTop=0,2===S(a,t,i)&&a.scrollIntoView()))},{dontForceLayout:!0,onlyHashChange:r.onlyHashChange}),d&&(r.onlyHashChange=!1,r.hashFragment=null)},void 0),(0,i.jsx)(d.Fragment,{ref:t,children:e.children})};function O({children:e,cacheNode:t}){let r=(0,d.useContext)(s.GlobalLayoutRouterContext);if(!r)throw Object.defineProperty(Error("invariant global layout router not mounted"),"__NEXT_ERROR_CODE",{value:"E473",enumerable:!1,configurable:!0});return(0,i.jsx)(_,{focusAndScrollRef:r.focusAndScrollRef,cacheNode:t,children:e})}function w({tree:e,segmentPath:t,debugNameContext:r,cacheNode:n,params:o,url:a,isActive:l}){let u,f=(0,d.useContext)(s.GlobalLayoutRouterContext);if((0,d.useContext)(g.NavigationPromisesContext),!f)throw Object.defineProperty(Error("invariant global layout router not mounted"),"__NEXT_ERROR_CODE",{value:"E473",enumerable:!1,configurable:!0});let m=null!==n?n:(0,d.use)(c.unresolvedThenable),p=null!==m.prefetchRsc?m.prefetchRsc:m.rsc,h=(0,d.useDeferredValue)(m.rsc,p);if((0,P.isDeferredRsc)(h)){let e=(0,d.use)(h);null===e&&(0,d.use)(c.unresolvedThenable),u=e}else null===h&&(0,d.use)(c.unresolvedThenable),u=h;let y=u;return(0,i.jsx)(s.LayoutRouterContext.Provider,{value:{parentTree:e,parentCacheNode:m,parentSegmentPath:t,parentParams:o,parentLoadingData:null,debugNameContext:r,url:a,isActive:l},children:y})}function x({loading:e,children:t}){let r=(0,d.use)(s.LayoutRouterContext);return null===r?t:(0,i.jsx)(s.LayoutRouterContext.Provider,{value:{parentTree:r.parentTree,parentCacheNode:r.parentCacheNode,parentSegmentPath:r.parentSegmentPath,parentParams:r.parentParams,parentLoadingData:e,debugNameContext:r.debugNameContext,url:r.url,isActive:r.isActive},children:t})}function T({name:e,loading:t,children:r}){if(null!==t){let n=t[0],o=t[1],a=t[2];return(0,i.jsx)(d.Suspense,{name:e,fallback:(0,i.jsxs)(i.Fragment,{children:[o,a,n]}),children:r})}return(0,i.jsx)(i.Fragment,{children:r})}function j({parallelRouterKey:e,error:t,errorStyles:r,errorScripts:n,templateStyles:o,templateScripts:a,template:l,notFound:u,forbidden:m,unauthorized:g,segmentViewBoundaries:P}){let S=(0,d.useContext)(s.LayoutRouterContext);if(!S)throw Object.defineProperty(Error("invariant expected layout router to be mounted"),"__NEXT_ERROR_CODE",{value:"E56",enumerable:!1,configurable:!0});let{parentTree:_,parentCacheNode:x,parentSegmentPath:C,parentParams:A,parentLoadingData:R,url:I,isActive:D,debugNameContext:E}=S,N=_[0],M=null===C?[e]:C.concat([N,e]),F=_[1][e],k=x.slots;(void 0===F||null===k)&&(0,d.use)(c.unresolvedThenable);let L=F[0],B=k[e]??null,U=(0,y.createRouterCacheKey)(L,!0),H=(0,v.useRouterBFCache)(F,B,U),V=[];do{let e=H.tree,d=H.cacheNode,c=H.stateKey,y=e[0],v=A;if(Array.isArray(y)){let e=y[0],t=y[1],r=y[2],n=(0,b.getParamValueFromCacheKey)(t,r);null!==n&&(v={...A,[e]:n})}let P=function(e){if("/"===e)return"/";if("string"==typeof e)if("(__SLOT__)"===e)return;else return e+"/";return e[1]+"/"}(y),S=P??E,_=void 0===P?void 0:E,x=(0,i.jsxs)(O,{cacheNode:d,children:[(0,i.jsx)(f.ErrorBoundary,{errorComponent:t,errorStyles:r,errorScripts:n,children:(0,i.jsx)(T,{name:_,loading:R,children:(0,i.jsx)(h.HTTPAccessFallbackBoundary,{notFound:u,forbidden:m,unauthorized:g,children:(0,i.jsxs)(p.RedirectBoundary,{children:[(0,i.jsx)(w,{url:I,tree:e,params:v,cacheNode:d,segmentPath:M,debugNameContext:S,isActive:D&&c===U}),null]})})})}),null]}),j=(0,i.jsxs)(s.TemplateContext.Provider,{value:x,children:[o,a,l]},c);V.push(j),H=H.next}while(null!==H)return V}("function"==typeof r.default||"object"==typeof r.default&&null!==r.default)&&void 0===r.default.__esModule&&(Object.defineProperty(r.default,"__esModule",{value:!0}),Object.assign(r.default,r),t.exports=r.default)},37457,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"default",{enumerable:!0,get:function(){return i}});let n=e.r(90809),o=e.r(18050),a=n._(e.r(71645)),l=e.r(8372);function i(){let e=(0,a.useContext)(l.TemplateContext);return(0,o.jsx)(o.Fragment,{children:e})}("function"==typeof r.default||"object"==typeof r.default&&null!==r.default)&&void 0===r.default.__esModule&&(Object.defineProperty(r.default,"__esModule",{value:!0}),Object.assign(r.default,r),t.exports=r.default)},6831,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"createRenderParamsFromClient",{enumerable:!0,get:function(){return o}});let n=new WeakMap;function o(e){let t=n.get(e);if(t)return t;let r=Promise.resolve(e);return n.set(e,r),r}("function"==typeof r.default||"object"==typeof r.default&&null!==r.default)&&void 0===r.default.__esModule&&(Object.defineProperty(r.default,"__esModule",{value:!0}),Object.assign(r.default,r),t.exports=r.default)},97689,(e,t,r)=>{"use strict";e.i(47167),Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"createRenderParamsFromClient",{enumerable:!0,get:function(){return n}});let n=e.r(6831).createRenderParamsFromClient;("function"==typeof r.default||"object"==typeof r.default&&null!==r.default)&&void 0===r.default.__esModule&&(Object.defineProperty(r.default,"__esModule",{value:!0}),Object.assign(r.default,r),t.exports=r.default)},93504,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"createRenderSearchParamsFromClient",{enumerable:!0,get:function(){return o}});let n=new WeakMap;function o(e){let t=n.get(e);if(t)return t;let r=Promise.resolve(e);return n.set(e,r),r}("function"==typeof r.default||"object"==typeof r.default&&null!==r.default)&&void 0===r.default.__esModule&&(Object.defineProperty(r.default,"__esModule",{value:!0}),Object.assign(r.default,r),t.exports=r.default)},66996,(e,t,r)=>{"use strict";e.i(47167),Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"createRenderSearchParamsFromClient",{enumerable:!0,get:function(){return n}});let n=e.r(93504).createRenderSearchParamsFromClient;("function"==typeof r.default||"object"==typeof r.default&&null!==r.default)&&void 0===r.default.__esModule&&(Object.defineProperty(r.default,"__esModule",{value:!0}),Object.assign(r.default,r),t.exports=r.default)},15783,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0});var n={createClientParams:function(){return a.createRenderParamsFromClient},createClientSearchParams:function(){return l.createRenderSearchParamsFromClient}};for(var o in n)Object.defineProperty(r,o,{enumerable:!0,get:n[o]});let a=e.r(97689),l=e.r(66996);("function"==typeof r.default||"object"==typeof r.default&&null!==r.default)&&void 0===r.default.__esModule&&(Object.defineProperty(r.default,"__esModule",{value:!0}),Object.assign(r.default,r),t.exports=r.default)},27201,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"IconMark",{enumerable:!0,get:function(){return o}});let n=e.r(18050),o=()=>"u">typeof window?null:(0,n.jsx)("meta",{name:"«nxt-icon»"})},91915,(e,t,r)=>{"use strict";function n(e,t={}){if(t.onlyHashChange)return void e();let r=document.documentElement;if("smooth"!==r.dataset.scrollBehavior)return void e();let o=r.style.scrollBehavior;r.style.scrollBehavior="auto",t.dontForceLayout||r.getClientRects(),e(),r.style.scrollBehavior=o}e.i(47167),Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"disableSmoothScrollDuringRouteTransition",{enumerable:!0,get:function(){return n}})}]);