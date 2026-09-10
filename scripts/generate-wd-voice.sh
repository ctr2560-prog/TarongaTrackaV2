#!/usr/bin/env bash
# generate-wd-voice.sh — builds the Wildest Dreams recorded voice clips.
#
# Everything a student TAPS in Wildest Dreams is a fixed, small vocabulary, so it does not need a
# speech synthesiser at all. A recorded clip is a plain <audio> file: identical on every device,
# no engine to wedge, no missing voice, and it can be a warm human voice rather than a robotic one.
#
# Run from the repo root:   bash scripts/generate-wd-voice.sh
# Output:                   public/voice/{key}.m4a
#
# ⚠️ THE VOICE HERE IS macOS "Karen" (en-AU), which is a PLACEHOLDER. It exists so the feature
#    works today. Apple's system voices are licensed for use ON a Mac, not for redistribution
#    inside a product, so before this ships publicly it should be replaced with either a real
#    recorded human voice or a voice you hold a licence for. Replacing it means dropping files
#    with the same names into public/voice/ — no code changes at all. Keys are listed below and
#    must match the `voice:` values in src/modes/wildest-dreams/content.js.
#
# To record a human instead: read each line below, save as {key}.m4a in public/voice/, done.
# Short, warm, unhurried. Leave a beat of silence at the start and end of each.

set -euo pipefail

VOICE="${WD_VOICE:-Karen}"          # WD_VOICE=Alex bash scripts/generate-wd-voice.sh
OUT="public/voice"
mkdir -p "$OUT"

say_clip() {
  local key="$1" text="$2"
  say -v "$VOICE" "$text" -o "$OUT/$key.aiff"
  afconvert "$OUT/$key.aiff" -f m4af -d aac -b 48000 "$OUT/$key.m4a"
  rm -f "$OUT/$key.aiff"
  printf '  %-22s %s\n' "$key.m4a" "\"$text\""
}

echo "Generating Wildest Dreams voice clips with '$VOICE'…"

echo "Animals:"
say_clip animal-koala       "Koala"
say_clip animal-kangaroo    "Kangaroo"
say_clip animal-giraffe     "Giraffe"
say_clip animal-chimpanzee  "Chimpanzee"
say_clip animal-lion        "Lion"
say_clip animal-gorilla     "Gorilla"
say_clip animal-rhino       "Rhino"
say_clip animal-tiger       "Tiger"

echo "Focus prompts:"
say_clip focus-like         "What I like"
say_clip focus-see          "What I see"
say_clip focus-hear         "What I hear"
say_clip focus-notice       "What I notice"
say_clip focus-feel         "How I feel"
say_clip focus-other        "Something else"

echo "Soundboard words:"
say_clip word-happy         "Happy"
say_clip word-excited       "Excited"
say_clip word-wow           "Wow"
say_clip word-look          "Look at that"
say_clip word-fav           "My favourite"
say_clip word-amazing       "Amazing"
say_clip word-calm          "Calm"
say_clip word-funny         "Funny"

echo
echo "Done. $(ls -1 "$OUT"/*.m4a | wc -l | tr -d ' ') clips in $OUT/ ($(du -sh "$OUT" | cut -f1))."
