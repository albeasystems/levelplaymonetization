#!/usr/bin/env bash
# Captures the landing-page screenshots from the app in the iOS Simulator, one set per language.
# Needs a DEBUG build of the app (it uses the -debug* launch arguments) installed on the simulator.
#
#   scripts/capture-shots.sh [language ...]          # default: all 12
#   DEVICE=<udid> APP=<path to .app>  scripts/capture-shots.sh en ja
#
# Output: raw-shots/<code>/<name>.png (git-ignored). Then run `npm run shots` to make the WebP files.
set -euo pipefail

DEVICE="${DEVICE:-7900B1BB-A48E-4610-99F6-6000ED6E914E}"   # iPhone 17 Pro
BUNDLE="com.albeasystems.levelplaymonetization"
OUT="$(cd "$(dirname "$0")/.." && pwd)/raw-shots"
LANGS=("$@"); [ ${#LANGS[@]} -eq 0 ] && LANGS=(en es de fr it pt ar hi zh-Hans ja ko vi)

xcrun simctl ui "$DEVICE" appearance light
xcrun simctl status_bar "$DEVICE" override --time 9:41 --batteryState charged --batteryLevel 100 --wifiBars 3 --cellularBars 4 --operatorName ""

# name | extra launch arguments | seconds to wait
SHOTS=(
  "overview|-debugTab overview|6"
  "attention|-debugScroll insights|8"
  "breakdown|-debugScroll countries|8"
  "apps|-debugTab apps|6"
  "app-detail|-debugTab apps -debugAppDetail Pixel_Quest|8"
  "countries-map|-debugTab countries|9"
  "countries-matrix|-debugTab countries -debugCountriesMode matrix|7"
  "networks|-debugTab networks|6"
  "report|-debugOpen reports -debugReport -debugReportPreview|15"
  "alert|-debugOpen alerts -debugAlertEditor|8"
)

for lang in "${LANGS[@]}"; do
  mkdir -p "$OUT/$lang"
  for spec in "${SHOTS[@]}"; do
    IFS='|' read -r name args wait <<<"$spec"
    args="${args//Pixel_Quest/Pixel Quest}"
    xcrun simctl terminate "$DEVICE" "$BUNDLE" >/dev/null 2>&1 || true
    # shellcheck disable=SC2086
    if [[ "$args" == *"Pixel Quest"* ]]; then
      xcrun simctl launch "$DEVICE" "$BUNDLE" -app_language "$lang" -debugPro 1 -debugReviewReset 1 -debugTab apps -debugAppDetail "Pixel Quest" >/dev/null
    else
      xcrun simctl launch "$DEVICE" "$BUNDLE" -app_language "$lang" -debugPro 1 -debugReviewReset 1 $args >/dev/null
    fi
    sleep "$wait"
    xcrun simctl io "$DEVICE" screenshot --type=png "$OUT/$lang/$name.png" >/dev/null 2>&1
    echo "$lang/$name"
  done
done
xcrun simctl terminate "$DEVICE" "$BUNDLE" >/dev/null 2>&1 || true
echo "done"
