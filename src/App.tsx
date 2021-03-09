import type { FC } from "react";

import styles from "./App.module.scss";

const App: FC = () => {
  return (
    <div>
      <h1 className={styles["helloWorld"]}>Hello, world!</h1>
    </div>
  );
};

export default App;
