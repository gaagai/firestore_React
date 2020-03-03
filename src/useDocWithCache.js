import { useEffect, useState } from "react";
import { db } from "./firebase";

const cache = {};
const pendingCache = {};

export default function useDoc(path) {
  const [doc, setDoc] = useState(cache[path]);

  useEffect(() => {
    if (doc) {
      return;
    }
    let stillMounted = true;

    //"get" will only get this data once
    //  when we use onSnapshot it will subscribe to changes
    // with "get", we need to use .then (it returns a promise)

    const pending = pendingCache[path];
    const promise = pending || (pendingCache[path] = db.doc(path).get());
    promise.then(doc => {
      if (stillMounted) {
        const user = {
          ...doc.data(),
          id: doc.id
        };
        setDoc(user);
        cache[path] = user;
      }
    });
    return () => {
      let stillMounted = false;
    };
  }, [path, doc]);
  return doc;
}
