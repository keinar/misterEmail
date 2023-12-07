import imgUrl from "../assets/imgs/Mister Email.png";

export function Home() {
  return (
    <section className="home">
      <h1>Welcome to Mister Email</h1>
      <img src={imgUrl} alt="" />
    </section>
  );
}
