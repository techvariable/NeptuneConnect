export function checkIfValidDemoQuery(value: string): { isValid: boolean, error: string } {
  const demoConstraints = ['drop', 'addv', 'addvertex', 'addedge', 'adde', 'property', 'addlabel']
  let errorObj = {
    isValid: true,
    error: ''
  }
  demoConstraints.forEach(constraint => {
    if (value.toLowerCase().includes(constraint)) {
      console.log('Demo cant work\n\n')
      errorObj = {
        isValid: false,
        error: 'You can not perform this operation in Demo mode!'
      }
    }
  })

  return errorObj
}
