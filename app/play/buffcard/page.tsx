"use client";

import { useState } from 'react';
import Blue from './_components/Blue';
import Red from './_components/Red';

const BuffCardPage = () => {
    const [selectedCard, setSelectedCard] = useState<null | 'blue' | 'red'>(null);

    return (
        <div className="flex-1 mt-3 min-vh overflow-x-hidden">
            {selectedCard === 'blue' ? (
                <Blue />
            ) : selectedCard === 'red' ? (
                <Red />
            ) : (
                <div className="is-rounded">
                    이곳에 온 걸 보니<br />
                    오늘 하루 자극이 필요할 거 같은데?<br />
                    카드 한 장 뽑아볼래?
                </div>
            )}

            {selectedCard === null && (
                <div className="mt-4 space-x-2">
                    <button onClick={()=>setSelectedCard('blue')}>blue</button>
                    <button onClick={()=>setSelectedCard('red')}>red</button>
                </div>
            )}
        </div>
    );
}

export default BuffCardPage;