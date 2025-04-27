import { useMutation } from '@apollo/client';
import { SAVE_TOOL_HISTORY } from '../graphql/mutations';

export const useSaveToolUsage = () => {
    const [saveToolHistory] = useMutation(SAVE_TOOL_HISTORY);
  
    const saveUsage = () => {
      const toolName = window.location.pathname.split('/').pop();
      if (toolName) {
        saveToolHistory({ variables: { toolName } })
          .then(() => {
          })
          .catch((error) => {
            console.error('Failed to save tool usage', error);
          });
      }
    };
  
    return saveUsage;
  };