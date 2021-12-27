import { init, ErrorHandler } from "../../Error";

import { init as InitLog } from "../../../../../app/logger";

jest.mock("../../../../../app/logger");

it("inits the handler", () => {
  expect(init()).toBeInstanceOf(ErrorHandler);
  expect(InitLog).toHaveBeenCalled();
});
