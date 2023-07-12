import AuthForm from "./auth-form";

export default function Home() {
  return (
    <div className="row">
      <div className="col-6">
        <h1 className="header">Beredskap i Norge</h1>
        <p className="">Logg inn for å se kart over beredskap i Norge.</p>
      </div>
      <div className="col-6 auth-widget">
        <AuthForm />
      </div>
    </div>
  );
}
