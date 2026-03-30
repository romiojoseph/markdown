(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,14333,49346,57437,e=>{"use strict";let t;var o=e.i(18050),a=e.i(71645);function n(e){return new Promise((t,o)=>{e.oncomplete=e.onsuccess=()=>t(e.result),e.onabort=e.onerror=()=>o(e.error)})}function r(){var e;let o;return t||(e="keyval",t=(t,a)=>(()=>{if(o)return o;let t=indexedDB.open("keyval-store");return t.onupgradeneeded=()=>t.result.createObjectStore(e),(o=n(t)).then(e=>{e.onclose=()=>o=void 0},()=>{}),o})().then(o=>a(o.transaction(e,t).objectStore(e)))),t}function i(e,t=r()){return t("readonly",t=>n(t.get(e)))}function d(e,t,o=r()){return o("readwrite",o=>(o.put(t,e),n(o.transaction)))}function s(e,t=r()){return t("readwrite",t=>(t.delete(e),n(t.transaction)))}let l="md_docs",c="md_folders",u="md_active_doc",m="Untitled",p="New Folder",f=[{id:"folder-main",name:"Documentation",parentId:null},{id:"folder-ai-core",name:"AI Core",parentId:"folder-main"},{id:"folder-ai-interaction",name:"AI Interaction",parentId:"folder-main"},{id:"folder-ai-rules",name:"AI Guidelines",parentId:"folder-main"},{id:"folder-dev-core",name:"Developer Guide",parentId:"folder-main"}],h=[{id:"doc-agents",name:"AGENTS.md",folderId:"folder-ai-core",content:`# AGENTS.md

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
`,createdAt:0,updatedAt:0}];e.s(["DEBOUNCE_MS",0,500,"DEFAULT_DOCS",0,h,"DEFAULT_FOLDERS",0,f,"EDITOR_MAX_WIDTH",0,"720px","UNTITLED_DOC",0,m,"UNTITLED_FOLDER",0,p],49346);let y="markdown_seeded";async function w(e,t){try{let t=await i(e);if(t)return t}catch(e){console.warn("IDB read failed, falling back to localStorage",e)}let o=localStorage.getItem(e);try{return o?JSON.parse(o):t}catch(e){if(o&&"string"==typeof t)return o;return t}}async function v(e,t){try{await d(e,t)}catch(e){console.warn("IDB write failed",e)}try{localStorage.setItem(e,"string"==typeof t?t:JSON.stringify(t))}catch(e){console.error("LocalStorage write failed",e)}}async function S(){return w(l,[])}async function g(e){return v(l,e)}async function I(){return w(c,[])}async function A(e){return v(c,e)}async function D(){try{let e=await i(u);if(e)return e}catch(e){}return localStorage.getItem(u)}async function T(e){if(e){try{await d(u,e)}catch(e){}localStorage.setItem(u,e)}else{try{await s(u)}catch(e){}localStorage.removeItem(u)}}async function b(){localStorage.getItem(y)||(await A(f),await g(h),localStorage.setItem(y,"true"))}async function E(){for(let e of[l,c,u,y]){try{await s(e)}catch(e){}try{localStorage.removeItem(e)}catch(e){}}}function O(){if("u">typeof crypto){if("function"==typeof crypto.randomUUID)return crypto.randomUUID();if("function"==typeof crypto.getRandomValues){let e=new Uint8Array(16);crypto.getRandomValues(e),e[6]=15&e[6]|64,e[8]=63&e[8]|128;let t=[...e].map(e=>e.toString(16).padStart(2,"0")).join("");return`${t.slice(0,8)}-${t.slice(8,12)}-${t.slice(12,16)}-${t.slice(16,20)}-${t.slice(20)}`}}return`id-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,11)}`}e.s(["loadActiveDoc",0,D,"loadDocs",0,S,"loadFolders",0,I,"resetAppStorage",0,E,"saveActiveDoc",0,T,"saveDocs",0,g,"saveFolders",0,A,"seedIfEmpty",0,b],57437);let R=(0,a.createContext)();e.s(["DocsProvider",0,function({children:e}){let[t,n]=(0,a.useState)([]),[r,i]=(0,a.useState)([]),[d,s]=(0,a.useState)(null),[l,c]=(0,a.useState)(!1);(0,a.useEffect)(()=>{!async function(){await b();let[e,t,o]=await Promise.all([S(),I(),D()]);n(e),i(t),s(o||(e.length>0?e[0].id:null)),c(!0)}()},[]),(0,a.useEffect)(()=>{l&&g(t)},[t,l]),(0,a.useEffect)(()=>{l&&A(r)},[r,l]),(0,a.useEffect)(()=>{l&&T(d)},[d,l]);let u=(e,t)=>{n(o=>o.map(o=>o.id===e?{...o,...t,updatedAt:Date.now()}:o))};return(0,o.jsx)(R.Provider,{value:{docs:t,folders:r,activeDocId:d,isMounted:l,createDoc:(e=null)=>{let t={id:O(),name:m,folderId:e,content:"",createdAt:Date.now(),updatedAt:Date.now()};return n(e=>[...e,t]),s(t.id),t},updateDoc:u,deleteDoc:e=>{n(t=>t.filter(t=>t.id!==e)),d===e&&s(null)},renameDoc:(e,t)=>u(e,{name:t}),moveDoc:(e,t)=>u(e,{folderId:t}),duplicateDoc:e=>{let o=t.find(t=>t.id===e);if(!o)return null;let a={...o,id:O(),name:`${o.name} (Copy)`,createdAt:Date.now(),updatedAt:Date.now()};return n(e=>[...e,a]),s(a.id),a},createFolder:(e=p)=>{let t={id:O(),name:e,parentId:null};return i(e=>[...e,t]),t},createFolderIn:(e=null,t=p)=>{let o={id:O(),name:t,parentId:e};return i(e=>[...e,o]),o},renameFolder:(e,t)=>{i(o=>o.map(o=>o.id===e?{...o,name:t}:o))},deleteFolder:(e,t=!1)=>{if(t){let t=(e,o)=>{let a=o.filter(t=>t.parentId===e),n=[...a];return a.forEach(e=>{n=[...n,...t(e.id,o)]}),n},o=t(e,r),a=new Set([e,...o.map(e=>e.id)]);i(e=>e.filter(e=>!a.has(e.id))),n(e=>{let t=e.filter(e=>!a.has(e.folderId));return d&&!t.some(e=>e.id===d)&&s(null),t})}else i(t=>t.filter(t=>t.id!==e).map(t=>t.parentId===e?{...t,parentId:null}:t)),n(t=>t.map(t=>t.folderId===e?{...t,folderId:null}:t))},moveFolder:(e,t)=>{i(o=>{let a=new Map(o.map(e=>[e.id,e]));return e===t||((e,t)=>{let o=a.get(e),n=new Set;for(;o&&o.parentId&&!n.has(o.id);){if(n.add(o.id),o.parentId===t)return!0;o=a.get(o.parentId)}return!1})(t,e)?o:o.map(o=>o.id===e?{...o,parentId:t}:o)})},setActiveDocId:s,importDocs:e=>{let t=e.map(e=>({id:O(),name:e.name||m,folderId:e.folderId||null,content:e.content||"",createdAt:Date.now(),updatedAt:Date.now()}));return n(e=>[...e,...t]),t.length>0&&s(t[0].id),t}},children:e})},"useDocs",0,()=>(0,a.useContext)(R)],14333)},55851,e=>{"use strict";var t=e.i(18050),o=e.i(71645);let a=(0,o.createContext)();e.s(["UIProvider",0,function({children:e}){let[n,r]=(0,o.useState)("edit"),[i,d]=(0,o.useState)(!0),[s,l]=(0,o.useState)(!0),[c,u]=(0,o.useState)(null),[m,p]=(0,o.useState)(null),[f,h]=(0,o.useState)(null),[y,w]=(0,o.useState)([]),v=(0,o.useRef)(0),[S,g]=(0,o.useState)([]),[I,A]=(0,o.useState)(new Set);return(0,o.useEffect)(()=>{let e=()=>{window.innerWidth<768&&("split"===n&&r("preview"),d(!1),l(!1))};return e(),window.addEventListener("resize",e),()=>window.removeEventListener("resize",e)},[n]),(0,t.jsx)(a.Provider,{value:{mode:n,setMode:r,sidebarOpen:i,toggleSidebar:()=>d(e=>!e),closeSidebar:()=>d(!1),toolbarOpen:s,toggleToolbar:()=>l(e=>!e),closeToolbar:()=>l(!1),activeModal:c,modalTarget:m,openModal:(e,t=null)=>{u(e),p(t)},closeModal:()=>{u(null),p(null)},selectionStats:f,setSelectionStats:h,toasts:y,pushToast:(e,t="info",o=2400)=>{let a=`toast-${v.current++}`;w(o=>[...o,{id:a,message:e,type:t}]),window.setTimeout(()=>{w(e=>e.filter(e=>e.id!==a))},o)},selectedIds:S,setSelectedIds:g,openFolderIds:I,toggleFolder:e=>{A(t=>{let o=new Set(t);return o.has(e)?o.delete(e):o.add(e),o})}},children:e})},"useUI",0,()=>(0,o.useContext)(a)])},89086,e=>{e.v({container:"ToastHost-module__GLtl8a__container",toast:"ToastHost-module__GLtl8a__toast"})},18810,e=>{"use strict";var t=e.i(18050),o=e.i(55851),a=e.i(89086);e.s(["default",0,function(){let{toasts:e}=(0,o.useUI)();return e&&0!==e.length?(0,t.jsx)("div",{className:a.default.container,"aria-live":"polite","aria-atomic":"true",children:e.map(e=>(0,t.jsx)("div",{className:`${a.default.toast} ${a.default[e.type]||""}`,children:e.message},e.id))}):null}])}]);