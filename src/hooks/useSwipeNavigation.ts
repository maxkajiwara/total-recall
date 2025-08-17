"use client";

import { useState, useEffect, useCallback } from "react";

export type Screen = "add" | "review" | "graph";

const SCREENS: Screen[] = ["add", "review", "graph"];
const DEFAULT_SCREEN: Screen = "review"; // Always open to Screen 2 (Review)
const STORAGE_KEY = "swipe-navigation-screen";

export function useSwipeNavigation() {
  const [currentScreenIndex, setCurrentScreenIndex] = useState(1); // Start at review (index 1)
  const [isInitialized, setIsInitialized] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored && SCREENS.includes(stored as Screen)) {
        const index = SCREENS.indexOf(stored as Screen);
        setCurrentScreenIndex(index);
      }
      setIsInitialized(true);
    }
  }, []);

  // Save to localStorage when screen changes
  useEffect(() => {
    if (isInitialized && typeof window !== "undefined") {
      const currentScreen = SCREENS[currentScreenIndex];
      if (currentScreen) {
        localStorage.setItem(STORAGE_KEY, currentScreen);
      }
    }
  }, [currentScreenIndex, isInitialized]);

  const currentScreen = SCREENS[currentScreenIndex];

  const goToScreen = useCallback((screen: Screen) => {
    const index = SCREENS.indexOf(screen);
    if (index !== -1) {
      setCurrentScreenIndex(index);
    }
  }, []);

  const goToNext = useCallback(() => {
    setCurrentScreenIndex((prev) => Math.min(prev + 1, SCREENS.length - 1));
  }, []);

  const goToPrevious = useCallback(() => {
    setCurrentScreenIndex((prev) => Math.max(prev - 1, 0));
  }, []);

  const getScreenOffset = useCallback((targetScreen: Screen) => {
    const targetIndex = SCREENS.indexOf(targetScreen);
    return targetIndex - currentScreenIndex;
  }, [currentScreenIndex]);

  return {
    currentScreen,
    currentScreenIndex,
    screens: SCREENS,
    goToScreen,
    goToNext,
    goToPrevious,
    getScreenOffset,
    isInitialized,
    canGoNext: currentScreenIndex < SCREENS.length - 1,
    canGoPrevious: currentScreenIndex > 0,
  };
}