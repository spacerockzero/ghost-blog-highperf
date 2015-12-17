/**
 * Main JS file for Casper behaviours
 */
/* Perf Note:
 * I evicted jQuery's fatness  and rewrote this little script in my favorite JS
 * library, VanillaJS. Goodbye, 33Kb. I will not miss you.
 */

window.onload = function(){
  var bodyEl = document.querySelector('body')
  var clickElements = document.querySelectorAll('.menu-button, .nav-cover, .nav-close')
  Array.prototype.forEach.call(clickElements, function(el, i) {
    el.addEventListener('click', function() {
      if (bodyEl.classList) {
          bodyEl.classList.toggle('nav-opened')
          bodyEl.classList.toggle('nav-closed')
      } else {
        var classes = bodyEl.className.split(' ')
        var existingIndex = classes.indexOf('nav-opened')
        if (existingIndex >= 0) {
          classes.splice(existingIndex, 1)
          classes.push('nav-closed')
        } else {
          classes.push('nav-opened')
          bodyEl.className = classes.join(' ')
        }
      }
    })
  })
}
