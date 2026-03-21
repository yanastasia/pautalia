import { createBrowserRouter } from "react-router";
import { HomePage } from "./pages/HomePage";
import { BuildingPage } from "./pages/BuildingPage";
import { ApartmentFinderPage } from "./pages/ApartmentFinderPage";
import { UnitDetailPage } from "./pages/UnitDetailPage";
import { DigitalTwinPage } from "./pages/DigitalTwinPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: HomePage,
  },
  {
    path: "/building",
    Component: BuildingPage,
  },
  {
    path: "/apartments",
    Component: ApartmentFinderPage,
  },
  {
    path: "/apartment/:id",
    Component: UnitDetailPage,
  },
  {
    path: "/digital-twin/:id",
    Component: DigitalTwinPage,
  },
]);
