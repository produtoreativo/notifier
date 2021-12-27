import { CustomError } from "..";

it("CustomError should be instanceof Error", () => {
  const error = new CustomError("test");
  expect(error).toBeInstanceOf(Error);
});
