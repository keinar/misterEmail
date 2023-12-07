import imgUrl from '../assets/imgs/react.png'

export function Home() {
    return (
        <section className="home">
            <h1>Welcome to our React App</h1>
            <img src={imgUrl} alt="" />
        </section>
    )
}
