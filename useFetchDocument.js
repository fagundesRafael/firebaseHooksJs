import { useState, useEffect } from "react";
import { db } from "../firebase/config";
import { doc, getDoc } from "firebase/firestore";

export const useFetchDocument = (docCollection, id) => {
  const [document, setDocuments] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(null);

  // deal with memory leak
  const [cancelled, setCancelled] = useState(false);

  useEffect(() => {
    async function loadDocument() {
      if (cancelled) {
        return;
      }

      setLoading(true);

      try {

        const docRef = await doc(db, docCollection, id)
        const docSnap = await getDoc(docRef)

        setDocuments(docSnap.data())

        setLoading(false);
        
      } catch (error) {
        setError(error.message)
      }


      setLoading(false);
    }

    loadDocument();
  }, [docCollection, cancelled, id]);

  useEffect(() => {
    return () => setCancelled(true);
  }, []);

  return { document, loading, error };
};