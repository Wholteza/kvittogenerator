import { KeyboardEventHandler, useMemo, useRef, useState, useCallback, MouseEventHandler } from "react"
import "./picker.scss";

const Keys = {
  ArrowUp: "ArrowUp",
  ArrowDown: "ArrowDown",
  Enter: "Enter",
  Escape: "Escape"
} as const;

type Props = {
  title: string
  keys: string[]
  selectedKey: string | undefined
  onSelected: (key: string) => void
}

export const Picker = ({ keys, selectedKey, onSelected, title }: Props) => {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [search, setSearch] = useState<string>("");
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const closeAndCleanInput = () => {
    dialogRef.current?.close();
    setSearch("")
    setSelectedIndex(0)
  }
  const filteredKeys = useMemo(() => {
    return keys.sort((a, b) => a.localeCompare(b)).filter(k => k.toLowerCase().includes(search.toLowerCase()))
  }, [keys, search])

  const normalizedSelectedIndex = useMemo(() => {
    return Math.abs(selectedIndex) % filteredKeys.length
  }, [filteredKeys.length, selectedIndex])

  const onPresenterClicked: MouseEventHandler<HTMLDivElement> = useCallback(() => {
    dialogRef.current?.show();
    inputRef.current?.focus();
  }, [])

  const onKeyDown: KeyboardEventHandler<HTMLDialogElement> = useCallback((event) => {
    const key = event.key;
    if (key === Keys.ArrowUp) {
      setSelectedIndex((prev) => prev - 1);
      return
    }
    if (key === Keys.ArrowDown) {
      setSelectedIndex((prev) => prev + 1);
      return
    }
    if (key === Keys.Enter) {
      if (filteredKeys.length === 0) {
        closeAndCleanInput();
        return;
      }
      onSelected(filteredKeys[normalizedSelectedIndex])
      closeAndCleanInput();
      return;
    }
    if (key === Keys.Escape) {
      closeAndCleanInput();
    }
  }, [onSelected, filteredKeys, normalizedSelectedIndex])



  return (<div className="picker-wrapper">
    <div
      onClick={onPresenterClicked}
      className="presenter"
    >
      {selectedKey}
    </div>
    <dialog
      ref={dialogRef}
      onKeyDown={onKeyDown}
      style={{ flexDirection: "column" }}
    >
      <div className="titlebar">
        <div className="title">{title}</div>
        <div className="actions">
          <div
            onClick={() => { closeAndCleanInput() }}
            className="icon"
          >❌</div>
        </div>
      </div>
      <div className="content">

        <input
          ref={inputRef}
          type="text"
          value={search}
          onChange={(event) => { setSearch(event.target.value) }}
          placeholder="Sök här.."
        />
        <div className="rows">
          {filteredKeys.map((k, i) => <div className={`row ${i === normalizedSelectedIndex ? "selected" : ""}`} key={k} onClick={() => { onSelected(k); closeAndCleanInput() }}>{k}</div>)
          }</div>
      </div>
    </dialog >
  </div >)
}
