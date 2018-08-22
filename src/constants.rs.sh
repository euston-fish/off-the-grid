cat << EOF
const SIZE: u32 = $(jq '.size' $1);
const DRY_DEPTH: u8 = $(jq '.simulation.dry_depth' $1);
EOF
