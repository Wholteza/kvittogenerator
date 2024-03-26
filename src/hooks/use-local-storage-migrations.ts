import { useEffect, useMemo } from "react";
import { ReceiptInformationV1, ReceiptInformationV2 } from "types";
import useLocalStorage from "../use-local-storage";

export const useLocalStorageMigrations = (propVersion: number) => {
  const [version, setVersion] = useLocalStorage<number>(
    "migrations-version",
    0
  );

  const migrations: { version: number; title: string; migrate: () => void }[] =
    useMemo(
      () => [
        {
          version: 0,
          title: "Initial migration",
          migrate: () => {
            /*pass*/
          },
        },
        {
          version: 1,
          title: "Rename property of number to receiptNumber",
          migrate: () => {
            const localStorageKey = "formData-receiptInformation";
            const rawData = localStorage.getItem(localStorageKey);
            if (!rawData) return;

            const v1 = JSON.parse(rawData) as ReceiptInformationV1;
            const v2 = JSON.parse(rawData) as ReceiptInformationV2;
            if (v2.receiptNumber) return;

            v2.receiptNumber = v1.number ?? "A1";

            localStorage.setItem(localStorageKey, JSON.stringify(v2));
          },
        },
      ],
      []
    );

  useEffect(() => {
    if (propVersion > version)
      migrations.slice(version + 1, propVersion + 1).forEach((migration) => {
        console.log(
          `Running migration: ${migration.version}\r\n${migration.title}`
        );
        migration.migrate();
        setVersion(migration.version);
      });
  }, [migrations, propVersion, setVersion, version]);
};
