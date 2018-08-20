SIZE=$(jq '.size' $1)

cat << EOF
const SIZE: u32 = ${SIZE};
EOF
