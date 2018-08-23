cat << EOF
const SIZE: u32 = $(jq '.size' $1);
const DRY_DEPTH: f32 = $(jq '.simulation.dry_depth' $1) as f32;
EOF
