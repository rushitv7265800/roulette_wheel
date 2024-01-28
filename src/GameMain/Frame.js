import React, { useEffect, useRef, useState } from "react";
import Coin50 from '../assets/coinButton/lightBlueCoin.png'
import Coin100 from '../assets/coinButton/pinkCoin.png'
import Coin200 from '../assets/coinButton/darkBlueCoin.png'
import Coin400 from '../assets/coinButton/blueCoin.png'
import Coin800 from '../assets/coinButton/darkRedCoin.png'
import Coin1000 from '../assets/coinButton/redCoin.png'
import CoinButtonShow from "./CoinButtonShow";

export default function Frame({
  arrCoins,
  totalBet,
  myBet,
  betDetails,
  mineCoin,
  multiCoin,
  gameCoin,
  onClick,
  winningFrames,
  framNo,
  coins,
  mine,
}) {
  let coinImages = [Coin50, Coin100, Coin200, Coin400, Coin800,Coin1000];
  const coinsRender = arrCoins?.map((obj, i) => {
    return (
      <CoinButtonShow
        key={i}
        name={
          obj.coin == gameCoin[0]
            ? gameCoin[0]
            : obj.coin == gameCoin[1]
              ? gameCoin[1]
              : obj.coin == gameCoin[2]
                ? gameCoin[2]
                : obj.coin == gameCoin[3]
                  ? gameCoin[3]
                  : obj.coin == gameCoin[4] && gameCoin[4]
                  ? gameCoin[4]
                  : obj.coin == gameCoin[5] && gameCoin[5]
        }
        src={
          obj.coin == gameCoin[0]
            ? coinImages[0]
            : obj.coin == gameCoin[1]
              ? coinImages[1]
              : obj.coin == gameCoin[2]
                ? coinImages[2]
                : obj.coin == gameCoin[3]
                  ? coinImages[3]
                  : obj.coin == gameCoin[4] && coinImages[4]
                  ? gameCoin[4]
                  : obj.coin == gameCoin[5] && gameCoin[5]
        }
        left={obj.left + "%"}
        top={obj.top + "%"}
      />
    );
  });
  const mineCoinRener = mineCoin?.map((obj, i) => {
    return (
      <CoinButtonShow
        key={i}
        mineCoin={true}
        name={
          obj.coin == gameCoin[0]
            ? gameCoin[0]
            : obj.coin == gameCoin[1]
              ? gameCoin[1]
              : obj.coin == gameCoin[2]
                ? gameCoin[2]
                : obj.coin == gameCoin[3]
                  ? gameCoin[3]
                  : obj.coin == gameCoin[4] && gameCoin[4]
                    ? gameCoin[4]
                    : obj.coin == gameCoin[5] && gameCoin[5]
        }
        src={
          obj.coin == gameCoin[0]
            ? coinImages[0]
            : obj.coin == gameCoin[1]
              ? coinImages[1]
              : obj.coin == gameCoin[2]
                ? coinImages[2]
                : obj.coin == gameCoin[3]
                  ? coinImages[3]
                  : obj.coin == gameCoin[4] && coinImages[4]
                    ? gameCoin[4]
                    : obj.coin == gameCoin[5] && gameCoin[5]
        }
        left={obj.left + "%"}
        top={obj.top + "%"}
      />
    );
  });

  return (
    <div className="bet-details">
      <div
        className={`bet-box ${winningFrames?.includes(framNo) ? "fram-light" : ""
          }`}
        onClick={onClick}
      >
        <div className="bet-top">
          <h6>
            {mine}/<span>{coins}</span>
          </h6>
        </div>
        <div className="bet-number">
          {/* {renderedCoins} */}
          {coinsRender}
          {mineCoinRener}
          <h4>{betDetails}</h4>
          <h5>
            &#9747;<span>{multiCoin}</span>
          </h5>
        </div>
      </div>
    </div>
  );
}
