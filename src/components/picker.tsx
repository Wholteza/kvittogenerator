import { useMemo, useRef, useState } from "react"

type Props = {
  keys: string[]
  selectedKey: string | undefined
  onSelected: (key: string) => void
}

export const Picker = ({ keys, selectedKey, onSelected }: Props) => {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [search, setSearch] = useState<string>("");
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const closeAndCleanInput = () => {
    dialogRef.current?.close();
    setSearch("")
  }
  const filteredKeys = useMemo(() => {
    return keys.filter(k => k.toLowerCase().includes(search.toLowerCase()))
  }, [keys, search])



  // TODO: Add on key down 
  return (<div style={{ backgroundColor: "hotpink" }}>
    <div onClick={() => { dialogRef.current?.show() }}>{selectedKey}</div>
    <dialog ref={dialogRef}  >
      <input type="text" value={search} onChange={(event) => { setSearch(event.target.value) }} />
      {filteredKeys.map((k, i) => <div onClick={() => { onSelected(k); closeAndCleanInput() }} style={{ borderStyle: i === 0 ? "solid" : "none" }}>{k}</div>)
      }
      <button onClick={() => { closeAndCleanInput() }}>❌</button>
    </dialog >
  </div >)
}
