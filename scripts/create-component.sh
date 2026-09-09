#!/bin/bash
# Usage:
# npm run g:c Name              -> component (Client)
# npm run g:p Name              -> page (Server)
# npm run g:p pageName/paramName -> dynamic page with param (Server)
#
# Adapted from https://github.com/orsonito/my-next-template for src/

TYPE=$1
NAME=$2

if [ -z "$TYPE" ] || [ -z "$NAME" ]; then
  echo "Usage: npm run g:c Name  or  npm run g:p Name"
  exit 1
fi

if [[ "$NAME" == *"/"* ]]; then
  BASE_NAME=$(echo "$NAME" | cut -d'/' -f1)
  PARAM_NAME=$(echo "$NAME" | cut -d'/' -f2)
  COMPONENT_NAME="$(echo "$BASE_NAME" | tr '[:upper:]' '[:lower:]')"
  COMPONENT_FUNCTION_NAME="$(tr '[:lower:]' '[:upper:]' <<< ${BASE_NAME:0:1})${BASE_NAME:1}"
  PARAM_FOLDER="[$PARAM_NAME]"
  DIR=src/app/$COMPONENT_NAME/$PARAM_FOLDER
  TSX_FILE="$DIR/page.tsx"
  TYPES_FILE="$DIR/$COMPONENT_NAME.types.ts"
else
  COMPONENT_NAME="$(echo "$NAME" | tr '[:upper:]' '[:lower:]')"
  COMPONENT_FUNCTION_NAME="$(tr '[:lower:]' '[:upper:]' <<< ${NAME:0:1})${NAME:1}"
  if [ "$TYPE" = "c" ]; then
    DIR=src/components/$COMPONENT_NAME
    TSX_FILE="$DIR/$COMPONENT_NAME.tsx"
  else
    DIR=src/app/$COMPONENT_NAME
    TSX_FILE="$DIR/page.tsx"
  fi
  TYPES_FILE="$DIR/$COMPONENT_NAME.types.ts"
fi

mkdir -p $DIR

CSS_FILE="$DIR/$COMPONENT_NAME.css"

if [[ "$NAME" == *"/"* ]]; then
  cat <<EOL > "$TSX_FILE"
import React from 'react'
import './$COMPONENT_NAME.css'
import { ${COMPONENT_FUNCTION_NAME}Props } from './$COMPONENT_NAME.types'

const $COMPONENT_FUNCTION_NAME = async ({ params, searchParams }: ${COMPONENT_FUNCTION_NAME}Props) => {
  const { $PARAM_NAME } = await params;

  return (
    <div className="$COMPONENT_NAME">
      $COMPONENT_FUNCTION_NAME Page<br />
      $PARAM_NAME: {$PARAM_NAME}
    </div>
  )
}

export default $COMPONENT_FUNCTION_NAME;
EOL
else
cat <<EOL > "$TSX_FILE"
$([ "$TYPE" = "c" ] && echo "\"use client\"")

import React from 'react'
import './$COMPONENT_NAME.css'
import { ${COMPONENT_FUNCTION_NAME}Props } from './$COMPONENT_NAME.types'
$([ "$TYPE" = "c" ] && echo "import { use${COMPONENT_FUNCTION_NAME} } from './$COMPONENT_NAME.hooks'")

const $COMPONENT_FUNCTION_NAME = $([ "$TYPE" = "p" ] && echo "async " || echo "")({}: ${COMPONENT_FUNCTION_NAME}Props) => {
$([ "$TYPE" = "c" ] && echo "  const {} = use${COMPONENT_FUNCTION_NAME}()")

  return (
    <div className="$COMPONENT_NAME">
      $COMPONENT_FUNCTION_NAME $([[ "$TYPE" = "c" ]] && echo "Component" || echo "Page")
    </div>
  )
}

export default $COMPONENT_FUNCTION_NAME;
EOL
fi

cat <<EOL > "$CSS_FILE"
/* Styles for $COMPONENT_FUNCTION_NAME */
.$COMPONENT_NAME {
  display: block;
}
EOL

if [ "$TYPE" = "c" ]; then
  HOOKS_FILE="$DIR/$COMPONENT_NAME.hooks.ts"
  cat <<EOL > "$HOOKS_FILE"
import { useState } from 'react'

export function use$COMPONENT_FUNCTION_NAME() {
  const [state, setState] = useState(null)
  return { state, setState }
}
EOL
fi

if [[ "$NAME" == *"/"* ]]; then
  cat <<EOL > "$TYPES_FILE"
export type ${COMPONENT_FUNCTION_NAME}Props = {
  params: Promise<{ $PARAM_NAME: string }>
  searchParams?: Promise<{ q?: string }>
}
EOL
else
  cat <<EOL > "$TYPES_FILE"
export type ${COMPONENT_FUNCTION_NAME}Props = {
  // Define your props here
}
EOL
fi

echo "$([[ "$TYPE" = "c" ]] && echo 'Component' || echo 'Page') $COMPONENT_FUNCTION_NAME created in $DIR ✅"
