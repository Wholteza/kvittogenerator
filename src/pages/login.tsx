import Typography from "~components/typography";

import "./login.scss";
import Input from "~components/auto-input";
import Button from "~components/button";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

const Login = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  return (
    <div className="page-login">
      {/* TODO: Add translation */}
      <Typography size="heading">Logga in</Typography>
      <Typography paragraph>
        Konton tillåter dig att spara ditt företags information, kunduppgifter
        och produktkatalog. Registrering är tyvärr inte öppen för allmänheten
        ännu. Kika tillbaka om ett tag!
      </Typography>

      <div>
        <Input
          label="Användarnamn"
          value={username}
          onChange={setUsername}
          className="username"
        ></Input>
        <Input
          label="Lösenord"
          value={password}
          onChange={setPassword}
          className="password"
        ></Input>
        <Button icon={faUser} type="action">
          Logga in
        </Button>
      </div>
    </div>
  );
};

export default Login;
