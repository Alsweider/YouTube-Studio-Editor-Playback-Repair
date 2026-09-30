# YouTube Studio Editor - Playback Repair

<a href="https://www.tampermonkey.net/">User script</a> to fix a common YouTube Studio editor bug where the toolbar disappears, the play/pause button stops responding, and the video freezes on the current frame.

- Adds a small "⟳ Repair editor" button in the bottom-right corner of the editor (or trigger it with **Alt+R**)
- Removes the inline style YouTube sometimes applies to hide the toolbar, without disturbing its original layout
- Reloads only the video element (not the whole page) to unstick a frozen decoder, then restores your previous playback position
- Shows a brief status message confirming what was done

The page itself is never reloaded, so unsaved cuts and other edits stay intact. Unlike simply refreshing the tab, the usual workaround, which discards anything unsaved.

## Download
* <a href="https://github.com/Alsweider/YouTube-Studio-Editor-Playback-Repair/releases/latest">Github</a>
* <a href="https://greasyfork.org/de/scripts/598040-youtube-studio-editor-playback-repair">Greasyfork</a>
* <a href="https://gist.github.com/Alsweider/6c2c41d9e40ca005ff2d29fced89f50a">Gist</a>

## Usage

Open a video in the YouTube Studio editor as normal. If the toolbar disappears or playback freezes, click the button (or press Alt+R). No configuration required.
