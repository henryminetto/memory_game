'use client'

import Image from "next/image";
import styles from "./page.module.css";
import React from "react";

export default function Home() {
  const items = [{
    id: 1,
    sameAs: 2,
    image: 'https://picsum.photos/200/200',
  },
  {
    id: 2,
    sameAs: 1,
    image: 'https://picsum.photos/200/200',
  },
  {
    id: 3,
    sameAs: 4,
    image: 'https://picsum.photos/200/202',
  },
  {
    id: 4,
    sameAs: 3,
    image: 'https://picsum.photos/200/202',
  },
  {
    id: 5,
    sameAs: 6,
    image: 'https://picsum.photos/200/201',
  },
  {
    id: 6,
    sameAs: 5,
    image: 'https://picsum.photos/200/201',
  }
  ];
  const [shuffledCards, setShuffledCards] = React.useState(items);
  const [youWin, setYouWin] = React.useState(false);
  const audioRef = React.useRef<HTMLAudioElement>(null);
  let clicked: number[] = []

  const delay = 1000;

  const validatePair = () => {
    const firstId = clicked[0];
    const secondId = clicked[1];
    const firstPair = items.find(item => item.id === firstId)?.sameAs;

    if (firstPair == secondId) {
      clicked = [];
    } else {
      const firstElement = document?.querySelector(`.${styles.card}[data-id="${firstId}"]`);
      const secondElement = document?.querySelector(`.${styles.card}[data-id="${secondId}"]`);

      if (firstElement && secondElement) {
        setTimeout(() => {
          firstElement.classList.remove(styles.showFace);
          secondElement.classList.remove(styles.showFace);

          clicked = [];

        }, delay);
      }
    }
  };

  const turnImages = (element: HTMLDivElement) => {
    if (element.classList.contains(styles.showFace)) {
      element.classList.remove(styles.showFace);
    }
    else if (!element.classList.contains(styles.showFace)) {
      element.classList.add(styles.showFace);
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>, id: number) => {
    if (!clicked.includes(id)) {
      clicked.push(id);

      if (clicked.length <= 2) {
        turnImages(e.currentTarget);
      }
      if (clicked.length === 2) {
        validatePair();
        return;
      }
    }
  }

  React.useEffect(() => {
    setShuffledCards(shuffleArray(items));
  }, []);

  React.useEffect(() => {
    const observer = new MutationObserver(() => {
      const cards = document.querySelectorAll(`.${styles.showFace}`);
      if (cards.length === items.length) {
        clicked = [];
        setYouWin(true);
        console.time('Game duration');
        setTimeout(() => {
          cards.forEach((card) => {
            const element = card as HTMLDivElement;
            element.classList.remove(styles.showFace);
          })
          setYouWin(false);
          console.timeEnd('Game duration');
        }, 300000);

      }
    });

    const cardsContainer = document.querySelector(`.${styles.cardsContainer}`);
    if (cardsContainer) {
      observer.observe(cardsContainer, { attributes: true, subtree: true, attributeFilter: ['class'] });
    }

    return () => observer.disconnect();
  }, []);

  function shuffleArray<T>(array: T[]): T[] {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }

  const CardsRender: React.FC = () => {
    return (
      <>
        {shuffledCards && shuffledCards.map((el: any, i: number) => {
          return (
            <div key={i} className={styles.card} onClick={(e) => handleClick(e, el.id)} data-id={el.id} data-sameas={el.sameAs}>
              <Image src={el.image} alt="" width={200} height={200} className={styles.face}></Image>
              <Image src={'/666.png'} alt="" width={200} height={200} className={styles.verse}></Image>
            </div>
          )
        })}
      </>
    );
  }
  // const handlePlayAudio = () => {
  //   if (audioRef.current) {
  //     audioRef.current.play(); // Start audio playback
  //   }
  // };

  // React.useEffect(() => {
  //   if (youWin) {
  //     handlePlayAudio();
  //   }
  // }, [youWin]);

  return (
    <div className={styles.page}>
      <div className={styles.cardsContainer}>
        <CardsRender></CardsRender>
      </div>
      {youWin &&
        <div className={styles.youWin}>
          <h1>PARABEM</h1>
          <iframe width="687" height="1221" src="https://www.youtube.com/embed/vx37NHFUqe4?autoplay=1&mute=!" title="DAVI CALMA CALABRESO  #shorts #bbb #bbb24 #reality" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen ></iframe>
        </div>
      }
      {/*   <audio ref={audioRef}>
       <source src="/calma-calabreso.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio> */}
    </div>
  );
}
