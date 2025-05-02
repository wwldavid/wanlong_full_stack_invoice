import Container from "./container";

const Footer = () => {
  return (
    <footer className="mt-8 mb-8">
      <Container className="flex justify-between gap-4 border-t border-t-teal-400">
        <p className="text-sm">
          {" "}
          Invoice Pad &copy; {new Date().getFullYear()}
        </p>
        <p className="text-sm">
          {" "}
          Created by Wanlong with Next.js, Xata, and Clerk
        </p>
      </Container>
    </footer>
  );
};

export default Footer;
