SIZE=$(jq '.size' $1)

cat << EOF
export const SIZE = ${SIZE};
EOF
