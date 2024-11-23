import MeetNav from "@/components/ui/meetNav";
import Navbar from "@/components/ui/Navbar";

export default function Layout({ children }: any) {
  return (
    <>
      <MeetNav />

      <main>{children}</main>
    </>
  );
}
