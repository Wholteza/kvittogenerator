import { useState } from "react";

export const Test = () => {
  const [showText, setShowText] = useState<boolean>(false);
  return (
    <>
      <button onClick={() => setShowText(!showText)}>click me</button>
      {showText ? <h1>Test Heading</h1> : <></>}
    </>
  );
};
