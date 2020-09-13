const dataIsArray = data => Array.isArray(data)

const updateConfig = (oldConfig, newConfig) => ({
  ...oldConfig, 
  ...newConfig
}) 

function DomRenderer () {}