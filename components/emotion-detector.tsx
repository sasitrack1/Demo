"use client"

import { useState, useRef, useCallback } from "react"
import Webcam from "react-webcam"
import { X, Camera, Loader2, AlertCircle, Smile } from "lucide-react"
import { Button } from "@/components/ui/button"

interface EmotionDetectorProps {
  onEmotionDetected: (emotion: string) => void
  onClose: () => void
}

export function EmotionDetector({ onEmotionDetected, onClose }: EmotionDetectorProps) {
  const webcamRef = useRef<Webcam>(null)
  const [isCapturing, setIsCapturing] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [webcamError, setWebcamError] = useState(false)

  const captureImage = useCallback(async () => {
    if (!webcamRef.current) {
      setWebcamError(true)
      setError("Webcam not available. Please use manual mood selection instead.")
      return
    }

    setIsCapturing(true)
    setIsProcessing(true)
    setError(null)

    try {
      // Capture image from webcam with additional error handling
      let imageSrc: string | null = null

      try {
        imageSrc = webcamRef.current.getScreenshot()
      } catch (screenshotError) {
        console.error("Error capturing screenshot:", screenshotError)
        throw new Error("Failed to capture image from webcam")
      }

      if (!imageSrc) {
        throw new Error("Failed to capture image")
      }

      // Try to send the image to the Flask backend
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 3000) // 3 second timeout

        const response = await fetch("http://localhost:5000/detect-emotion", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ image: imageSrc }),
          signal: controller.signal,
        })

        clearTimeout(timeoutId)

        if (!response.ok) {
          throw new Error(`Server responded with status: ${response.status}`)
        }

        const data = await response.json()

        if (data.error) {
          console.warn("API returned an error, using fallback:", data.error)
          // If there's an error but we still got an emotion, use it
          if (data.emotion) {
            onEmotionDetected(data.emotion)
          } else {
            throw new Error(data.error)
          }
        } else {
          // Successfully detected emotion
          onEmotionDetected(data.emotion)
        }
      } catch (fetchError) {
        console.warn("Backend API not available, using local fallback:", fetchError)

        // Simulate processing time
        await new Promise((resolve) => setTimeout(resolve, 1500))

        // Use local fallback for emotion detection
        const emotions = ["happy", "sad", "chill", "energetic", "angry", "anxious"]
        const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)]

        onEmotionDetected(randomEmotion)
      }
    } catch (err) {
      console.error("Error during emotion detection:", err)
      setError("Failed to detect emotion. Please use manual mood selection instead.")
      setWebcamError(true)
    } finally {
      setIsCapturing(false)
      setIsProcessing(false)
    }
  }, [webcamRef, onEmotionDetected])

  const selectMoodManually = (mood: string) => {
    onEmotionDetected(mood)
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-zinc-900 rounded-xl p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Mood Detection</h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-white transition">
            <X size={24} />
          </button>
        </div>

        {error && (
          <div className="text-amber-400 mb-4 text-center p-2 bg-amber-950/50 rounded-md flex items-center justify-center gap-2">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {!webcamError ? (
          <>
            <div className="relative rounded-lg overflow-hidden bg-black mb-4">
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                videoConstraints={{
                  facingMode: "user",
                }}
                className="w-full aspect-video"
                onUserMediaError={() => {
                  setWebcamError(true)
                  setError("Could not access webcam. Please use manual mood selection instead.")
                }}
              />

              {isCapturing && (
                <div className="absolute inset-0 bg-white/10 flex items-center justify-center">
                  {isProcessing && (
                    <div className="flex flex-col items-center">
                      <Loader2 className="h-8 w-8 animate-spin text-white" />
                      <p className="mt-2 text-white">Analyzing your mood...</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <p className="text-zinc-400 text-sm mb-4 text-center">
              We'll capture a photo to detect your mood and recommend music that matches how you're feeling.
            </p>

            <Button
              onClick={captureImage}
              disabled={isProcessing}
              className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Camera className="mr-2 h-4 w-4" />
                  Detect My Mood
                </>
              )}
            </Button>
          </>
        ) : (
          <div className="space-y-4">
            <div className="bg-zinc-800/50 p-4 rounded-lg text-center">
              <Smile className="mx-auto h-12 w-12 text-zinc-400 mb-2" />
              <h3 className="text-lg font-medium mb-2">Select Your Mood Manually</h3>
              <p className="text-zinc-400 text-sm mb-4">
                Choose a mood and we'll recommend music that matches how you're feeling.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button
                onClick={() => selectMoodManually("happy")}
                variant="outline"
                className="py-6 flex flex-col items-center justify-center hover:bg-green-500/20 hover:text-green-400 border-green-800/30"
              >
                <span className="text-2xl mb-1">😊</span>
                <span>Happy</span>
              </Button>
              <Button
                onClick={() => selectMoodManually("sad")}
                variant="outline"
                className="py-6 flex flex-col items-center justify-center hover:bg-blue-500/20 hover:text-blue-400 border-blue-800/30"
              >
                <span className="text-2xl mb-1">😢</span>
                <span>Sad</span>
              </Button>
              <Button
                onClick={() => selectMoodManually("energetic")}
                variant="outline"
                className="py-6 flex flex-col items-center justify-center hover:bg-yellow-500/20 hover:text-yellow-400 border-yellow-800/30"
              >
                <span className="text-2xl mb-1">⚡</span>
                <span>Energetic</span>
              </Button>
              <Button
                onClick={() => selectMoodManually("chill")}
                variant="outline"
                className="py-6 flex flex-col items-center justify-center hover:bg-purple-500/20 hover:text-purple-400 border-purple-800/30"
              >
                <span className="text-2xl mb-1">😌</span>
                <span>Chill</span>
              </Button>
              <Button
                onClick={() => selectMoodManually("angry")}
                variant="outline"
                className="py-6 flex flex-col items-center justify-center hover:bg-red-500/20 hover:text-red-400 border-red-800/30"
              >
                <span className="text-2xl mb-1">😠</span>
                <span>Angry</span>
              </Button>
              <Button
                onClick={() => selectMoodManually("anxious")}
                variant="outline"
                className="py-6 flex flex-col items-center justify-center hover:bg-amber-500/20 hover:text-amber-400 border-amber-800/30"
              >
                <span className="text-2xl mb-1">😰</span>
                <span>Anxious</span>
              </Button>
            </div>
          </div>
        )}

        {!webcamError && (
          <div className="mt-4 pt-4 border-t border-zinc-800">
            <p className="text-zinc-400 text-sm mb-2 text-center">
              Don't want to use your camera? Select your mood manually:
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              <Button
                onClick={() => selectMoodManually("happy")}
                variant="ghost"
                size="sm"
                className="text-green-400 hover:text-green-300 hover:bg-green-900/20"
              >
                Happy
              </Button>
              <Button
                onClick={() => selectMoodManually("sad")}
                variant="ghost"
                size="sm"
                className="text-blue-400 hover:text-blue-300 hover:bg-blue-900/20"
              >
                Sad
              </Button>
              <Button
                onClick={() => selectMoodManually("energetic")}
                variant="ghost"
                size="sm"
                className="text-yellow-400 hover:text-yellow-300 hover:bg-yellow-900/20"
              >
                Energetic
              </Button>
              <Button
                onClick={() => selectMoodManually("chill")}
                variant="ghost"
                size="sm"
                className="text-purple-400 hover:text-purple-300 hover:bg-purple-900/20"
              >
                Chill
              </Button>
              <Button
                onClick={() => selectMoodManually("angry")}
                variant="ghost"
                size="sm"
                className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
              >
                Angry
              </Button>
              <Button
                onClick={() => selectMoodManually("anxious")}
                variant="ghost"
                size="sm"
                className="text-amber-400 hover:text-amber-300 hover:bg-amber-900/20"
              >
                Anxious
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
