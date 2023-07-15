import { Metadata } from "next";
import { MapComponent } from "./map-component";

export const metadata: Metadata = {
  viewport: {
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    minimumScale: 1,
    width: "device-width",
    height: "device-height",
  },
};

export default async function Page() {
  return <MapComponent />;
}
