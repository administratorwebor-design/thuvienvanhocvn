// Recovered from the surviving frontend bundle; local variable names are not original.
import { React, dw } from './runtime.js';
function useAuth() {
  const t = React.useContext(dw);
  if (t === void 0) throw new Error("useAuth must be used within an AuthProvider");
  return t;
}
export { useAuth };
