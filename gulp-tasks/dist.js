import gulp from 'gulp';
import gulpif from 'gulp-if';
import del from 'del';

import { PRODUCTION } from '../config';
import PATHS from '../paths';

export default function dist() {
	del(PATHS.dist.to);
	return gulp.src(PATHS.dist.from).pipe(gulpif(PRODUCTION, gulp.dest(PATHS.dist.to)));
}
