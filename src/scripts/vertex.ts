const dataIsArray = (data: any[]) => {
  return Array.isArray(data);
};

const updateConfig = (oldConfig: any, newConfig: any): any => ({
  ...oldConfig, 
  ...newConfig
});

function DomRenderer () {}