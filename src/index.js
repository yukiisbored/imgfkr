import { Application, Controller } from '@hotwired/stimulus'
import { debounceTime, fromEvent, map } from 'rxjs'

const app = Application.start()

app.register('app', class extends Controller {
  static targets = ['input', 'viewer', 'editor', 'error']

  upload() {
    const input = this.inputTarget
    const editor = this.editorTarget
    const viewer = this.viewerTarget
    const error = this.errorTarget

    if (input.files && input.files[0]) {
      error.textContent = ''

      const file = input.files[0]

      if (!file.type.startsWith('image/')) {
        error.textContent = 'Please upload an image file'
        return
      }

      const reader = new FileReader()

      reader.onload = (e) => {
        const editor$ = fromEvent(editor, 'input')

        editor$
          .pipe(
            debounceTime(1000),
            map(e => e.target.value),
          )
          .subscribe(value => {
            viewer.src = value
          })

        editor.value = e.target.result
        viewer.src = e.target.result
      }

      reader.readAsDataURL(file)
    }
  }
})
