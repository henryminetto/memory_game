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

  let clicked: number[] = []

  const validatePair = () => {
    const firstId = clicked[0];
    const secondId = clicked[1];
    const firstPair = items.find(item => item.id === firstId)?.sameAs;
    if (firstPair == secondId) {
     //vou deixar pq deve ter alguma animacao/particula
    } else {
      const firstElement = document?.querySelector(`.${styles.card}[data-id="${firstId}"]`);
      const secondElement = document?.querySelector(`.${styles.card}[data-id="${secondId}"]`);
      console.log('Not a pair', firstElement, secondElement);
      if (firstElement && secondElement) {
        firstElement?.classList.remove(styles.showFace);
        secondElement?.classList.remove(styles.showFace);
      }
    }
    clicked = [];
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

    turnImages(e.currentTarget);
    clicked.push(id);
    if (clicked.length === 2) {
      validatePair();
    }
  }

  React.useEffect(() => {
    const observer = new MutationObserver(() => {
      const cards = document.querySelectorAll(`.${styles.showFace}`);
      if (cards.length === items.length) {
        alert('You found all pairs!');
        clicked = [];
        cards.forEach((card) => {
          console.log('card', card)
          const element = card as HTMLDivElement;
          console.log('element', element)
          element.classList.remove(styles.showFace);
        })
      }
    });

    const cardsContainer = document.querySelector(`.${styles.cardsContainer}`);
    if (cardsContainer) {
      observer.observe(cardsContainer, { attributes: true, subtree: true, attributeFilter: ['class'] });
    }

    return () => observer.disconnect();
  }, []);

  const CardsRender: React.FC = () => {
    return (
      <>
        {items.map((el: any, i: number) => {
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

  return (
    <div className={styles.page}>
      <div className={styles.cardsContainer}>
        <CardsRender></CardsRender>
      </div>
    </div>
  );
}
