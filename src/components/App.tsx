import type { VFC } from "react";

import styles from "./App.module.scss";

const App: VFC = () => (
  <div>
    <h1 className={styles["title"]}>Hello, React!</h1>
  </div>
);

export default App;
