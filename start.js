const {
   spawn
} = require('child_process')
const path = require('path')

let child // Store child process reference

function start() {
   if (child) {
      child.removeAllListeners() // Clean up listeners
   }
   
   let args = [path.join(__dirname, 'main.js'), ...process.argv.slice(2)]
   console.log([process.argv[0], ...args].join('\n'))
   
   child = spawn(process.argv[0], args, {
      stdio: ['inherit', 'inherit', 'inherit', 'ipc']
   })
   
   child
      .on('message', data => {
         if (data == 'reset') {
            console.log('Restarting Bot...')
            child.kill()
            // Don't call start() immediately - let exit event handle it
         }
      })
      .on('error', err => {
         console.error('Failed to start child process:', err)
         // Restart after a delay to avoid rapid failure loops
         setTimeout(start, 1000)
      })
      .on('exit', (code, signal) => {
         console.log(`Child process exited with code ${code} and signal ${signal}`)
         
         // Clean up
         child = null
         
         // Check if we should restart
         // Exit code 0 usually means normal exit, adjust based on your needs
         if (code === 0 || code === 1 || signal === 'SIGTERM') {
            console.log('Restarting in 1 second...')
            setTimeout(start, 1000) // Add delay to prevent rapid restarts
         }
      })
}

// Handle parent process termination
process.on('SIGINT', () => {
   console.log('Received SIGINT, shutting down...')
   if (child) {
      child.kill('SIGINT')
   }
   process.exit(0)
})

process.on('SIGTERM', () => {
   console.log('Received SIGTERM, shutting down...')
   if (child) {
      child.kill('SIGTERM')
   }
   process.exit(0)
})

start()
