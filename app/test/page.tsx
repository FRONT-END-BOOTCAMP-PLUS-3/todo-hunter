"use client";

import { useUserStore } from "@/utils/stores/userStore";

export default function Test() {
  const { id, loginId, nickname, progress, str, int, emo, fin, liv, endingState, endingCount } = useUserStore();

  return (
    <div>
      <div>ID: {id}</div>
      <div>LoginId: {loginId}</div>
      <div>Nickname: {nickname}</div>
      <div>Progress: {progress}</div>
      <div>Str: {str}</div>
      <div>Int: {int}</div>
      <div>Emo: {emo}</div>
      <div>Fin: {fin}</div>
      <div>Liv: {liv}</div>
      <div>EndingCount: {endingCount}</div>
      <div>EndingState: {endingState}</div>
    </div>
  );
}
