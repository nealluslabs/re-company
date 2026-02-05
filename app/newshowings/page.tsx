// pages/new-showing.tsx
import React, { useState } from "react";
import { collection, addDoc, getDocs, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/config";

type Showing = {
  address: string;
  city: string;
  state: string;
  invitees: string[]; // array of agent identifiers (e.g., emails or ids)
  showingTime: string; // ISO string
  showingID: string; // s001, s002,...
  createdAt?: any;
};

function zeroPadNumber(n: number, width = 3) {
  return n.toString().padStart(width, "0");
}

async function getNextShowingID() {
  const showingsCol = collection(db, "showings");
  const snapshot = await getDocs(showingsCol);

  let maxNum = 0;
  snapshot.forEach((doc) => {
    const data = doc.data() as any;
    const sid: string | undefined = data?.showingID;
    if (sid && typeof sid === "string") {
      const m = sid.match(/s0*([0-9]+)$/i);
      if (m && m[1]) {
        const num = parseInt(m[1], 10);
        if (!Number.isNaN(num) && num > maxNum) maxNum = num;
      }
    }
  });

  const nextNum = maxNum + 1;
  return `s${zeroPadNumber(nextNum, 3)}`; // s001, s002, ...
}

export default function NewShowingPage() {
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [stateVal, setStateVal] = useState("");
  const [inviteeInput, setInviteeInput] = useState("");
  const [invitees, setInvitees] = useState<string[]>([]);
  const [showingTime, setShowingTime] = useState(""); // use datetime-local input value
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  function addInvitee() {
    const v = inviteeInput.trim();
    if (!v) return;
    setInvitees((prev) => [...prev, v]);
    setInviteeInput("");
  }

  function removeInvitee(idx: number) {
    setInvitees((prev) => prev.filter((_, i) => i !== idx));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);

    if (!address || !city || !stateVal || !showingTime) {
      setMessage("Please fill address, city, state and time.");
      return;
    }

    setLoading(true);
    try {
      const newShowingID = await getNextShowingID();

      const showing: Showing = {
        address,
        city,
        state: stateVal,
        invitees,
        showingTime: new Date(showingTime).toISOString(),
        showingID: newShowingID,
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, "showings"), showing);

      setMessage(`Showing created with ID ${newShowingID}`);
      // clear form
      setAddress("");
      setCity("");
      setStateVal("");
      setInvitees([]);
      setShowingTime("");
    } catch (err: any) {
      console.error("Failed to create showing", err);
      setMessage("Failed to create showing: " + (err?.message || err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: 20 }}>
      <h1>Add New Showing</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label>
            Address
            <br />
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Address"
              style={{ width: "100%", padding: 8 }}
            />
          </label>
        </div>

        <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
          <label style={{ flex: 1 }}>
            City
            <br />
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="City"
              style={{ width: "100%", padding: 8 }}
            />
          </label>

          <label style={{ width: 160 }}>
            State
            <br />
            <input
              type="text"
              value={stateVal}
              onChange={(e) => setStateVal(e.target.value)}
              placeholder="State"
              style={{ width: "100%", padding: 8 }}
            />
          </label>
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>
            Invitees
            <br />
            <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
              <input
                type="text"
                value={inviteeInput}
                onChange={(e) => setInviteeInput(e.target.value)}
                placeholder="Agent email or id"
                style={{ flex: 1, padding: 8 }}
              />
              <button type="button" onClick={addInvitee}>
                Add
              </button>
            </div>
            <div>
              {invitees.length === 0 && <small>No invitees added</small>}
              {invitees.map((inv, idx) => (
                <div key={idx} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span>{inv}</span>
                  <button type="button" onClick={() => removeInvitee(idx)}>
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </label>
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>
            Time
            <br />
            <input
              type="datetime-local"
              value={showingTime}
              onChange={(e) => setShowingTime(e.target.value)}
              style={{ padding: 8 }}
            />
          </label>
        </div>

        <div>
          <button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Submit"}
          </button>
        </div>
      </form>

      {message && (
        <div style={{ marginTop: 16 }}>
          <strong>{message}</strong>
        </div>
      )}
    </div>
  );
}