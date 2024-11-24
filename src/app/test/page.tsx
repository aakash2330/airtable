"use client";

import { useState } from "react";

export default function Page() {
  const [data, setData] = useState([{ a: "hello" }, { b: "world" }]);
  const { a: _, ...rest } = data;
  console.log({ rest });
  return <div>{JSON.stringify(data)}</div>;
}
