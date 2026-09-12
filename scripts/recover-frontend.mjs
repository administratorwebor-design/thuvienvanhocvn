// One-time recovery from the surviving production bundle. Never run over edited source.
import fs from 'node:fs';
import path from 'node:path';
import { parse } from '@babel/parser';
import traverseModule from '@babel/traverse';
import generatorModule from '@babel/generator';
const traverse = traverseModule.default;
const generate = generatorModule.default;
if (fs.existsSync('frontend/src/App.js')) throw new Error('Recovered source exists; refusing to overwrite edits.');
const source = fs.readFileSync('assets/index-DsMfHsI5.js', 'utf8');
const ast = parse(source, { sourceType: 'module' });
const pages = {
  WD: 'AuthProvider', Si: 'useAuth', C5: 'AdminLayout', GR: 'LiteratureAssistant',
  XR: 'SiteLayout', x0: 'GuestRoute', QR: 'AdminLogin', KR: 'AdminDashboard',
  YR: 'AdminUsers', WR: 'AdminCategories', ZR: 'AdminStorybooks', JR: 'AdminVideos',
  eM: 'AdminElearnings', tM: 'AdminQuizzes', nM: 'AdminQuizResults', iM: 'AdminBanners',
  Ud: 'useCategories', oM: 'HomePage', uM: 'StorybooksPage', VN: 'VideoPlayer',
  mU: 'StoryQuiz', gU: 'FlashcardDialog', yU: 'StoryAssistantMenu', xU: 'StoryChat',
  bU: 'StorybookDetail', vU: 'VideosPage', _U: 'VideoDetail', TU: 'ElearningsPage',
  SU: 'ElearningDetail', wU: 'QuizzesPage', EU: 'QuizPage', CU: 'LoginPage',
  NU: 'RegisterPage', AU: 'MyResultsPage', kU: 'ResultDetail', jU: 'StoryQuizHistory',
  DU: 'MyFlashcardsPage', OU: 'ProfilePage', RU: 'VerifyEmailPage',
  MU: 'ForgotPasswordPage', LU: 'ResetPasswordPage', PU: 'App',
};
let program;
traverse(ast, { Program(p) { program = p; } });
for (const [oldName, newName] of Object.entries({ ...pages, Me: 'apiClient', W: 'React', u: 'jsxRuntime', wt: 'useQuery', ht: 'useMutation', Ns: 'useQueryClient', Fe: 'Link', ro: 'useParams', cs: 'useNavigate' })) {
  if (program.scope.hasOwnBinding(oldName)) program.scope.rename(oldName, newName);
}
const pageNames = new Set(Object.values(pages));
const groups = new Map([['runtime', []], ['main', []]]);
const owners = new Map();
for (const p of program.get('body')) {
  const node = p.node;
  const group = node.type === 'FunctionDeclaration' && pageNames.has(node.id.name)
    ? node.id.name : node.type === 'ExpressionStatement' && generate(node).code.includes('createRoot(document.getElementById') ? 'main' : 'runtime';
  if (!groups.has(group)) groups.set(group, []);
  groups.get(group).push(p);
  for (const name of Object.keys(p.getBindingIdentifiers())) owners.set(name, group);
}
const deps = new Map();
const exports = new Map();
for (const [group, nodes] of groups) {
  deps.set(group, new Map());
  for (const p of nodes) p.traverse({ ReferencedIdentifier(ref) {
    const name = ref.node.name;
    const binding = ref.scope.getBinding(name);
    if (!binding || binding.scope !== program.scope) return;
    const owner = owners.get(name);
    if (!owner || owner === group) return;
    if (!deps.get(group).has(owner)) deps.get(group).set(owner, new Set());
    deps.get(group).get(owner).add(name);
    if (!exports.has(owner)) exports.set(owner, new Set());
    exports.get(owner).add(name);
  } });
}
fs.mkdirSync('frontend/src', { recursive: true });
for (const [group, nodes] of groups) {
  const imports = [...deps.get(group)].map(([owner, names]) => `import { ${[...names].join(', ')} } from './${owner}.js';`).join('\n');
  const body = nodes.map(p => generate(p.node, { comments: true }).code).join('\n\n');
  const footer = exports.has(group) ? `\nexport { ${[...exports.get(group)].join(', ')} };\n` : '';
  fs.writeFileSync(path.join('frontend/src', `${group}.js`), `// Recovered from the surviving frontend bundle; local variable names are not original.\n${imports}\n${body}${footer}`);
}
fs.copyFileSync('assets/index-23wMMyrY.css', 'frontend/styles.css');
console.log(`Recovered ${groups.size} editable frontend modules.`);
