#!/bin/bash
cd /home/kavia/workspace/code-generation/vivid-portfolio-220278-220288/frontend_ui
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

