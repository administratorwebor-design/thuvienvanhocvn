import {React} from './runtime.js';
import {useAuth} from './useAuth.js';

// Keep unfinished authoring in this browser tab, isolated by teacher and class.
export function useTeacherDraft(scope, field, initial) {
  const {user}=useAuth();
  const key=`teacher-draft:${user?._id}:${scope}:${field}`;
  const [value,setValue]=React.useState(()=>{
    try {const stored=sessionStorage.getItem(key);if(stored!==null)return JSON.parse(stored);}catch{}
    return typeof initial==='function'?initial():initial;
  });
  React.useEffect(()=>{try{sessionStorage.setItem(key,JSON.stringify(value));}catch{}},[key,value]);
  return [value,setValue];
}
