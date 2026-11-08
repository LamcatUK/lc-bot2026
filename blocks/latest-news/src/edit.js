import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';
import { TextControl, SelectControl, ToggleControl, RangeControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import EditorBlockShell from '../../_shared/EditorBlockShell';

export default function Edit( { attributes, setAttributes, clientId } ) {
	const { title, term, excludeTerm, count, paginate, showExcerpt, showTerm, showFilters, surface } = attributes;
	const { brushTop, spaceTop, spaceBottom } = attributes;
	const blockProps = useBlockProps( { className: 'container lc-bot2026-editor-block' } );
	const terms = useSelect( ( select ) => select( coreStore ).getEntityRecords( 'taxonomy', 'category', { per_page: 100, hide_empty: false } ), [] );
	const options = [ { value: '', label: __( 'Any', 'lc-bot2026' ) }, ...( terms || [] ).map( ( t ) => ( { value: t.slug, label: t.name } ) ) ];

	return (
		<EditorBlockShell blockProps={ blockProps } clientId={ clientId } title="Latest Posts" textDomain="lc-bot2026">
			<TextControl label={ __( 'Heading', 'lc-bot2026' ) } value={ title } onChange={ ( v ) => setAttributes( { title: v } ) } />
			<div style={ { display: 'flex', gap: '12px' } }>
				<div style={ { flex: '1 1 0' } }><SelectControl label={ __( 'Show posts in', 'lc-bot2026' ) } value={ term } options={ options } onChange={ ( v ) => setAttributes( { term: v } ) } /></div>
				<div style={ { flex: '1 1 0' } }><SelectControl label={ __( 'Except posts in', 'lc-bot2026' ) } value={ excludeTerm } options={ options } onChange={ ( v ) => setAttributes( { excludeTerm: v } ) } /></div>
			</div>
			<RangeControl label={ __( 'Posts per page', 'lc-bot2026' ) } value={ count } min={ 1 } max={ 24 } onChange={ ( v ) => setAttributes( { count: v } ) } />
			<ToggleControl label={ __( 'Page through older posts', 'lc-bot2026' ) } checked={ !! paginate } onChange={ ( v ) => setAttributes( { paginate: v } ) } />
			<ToggleControl label={ __( 'Show topic filters', 'lc-bot2026' ) } help={ __( 'Chips above the posts that filter by topic in the browser. Shows every matching post on one page, so paging is ignored.', 'lc-bot2026' ) } checked={ !! showFilters } onChange={ ( v ) => setAttributes( { showFilters: v } ) } />
			<ToggleControl label={ __( 'Show a short excerpt', 'lc-bot2026' ) } checked={ showExcerpt !== false } onChange={ ( v ) => setAttributes( { showExcerpt: v } ) } />
			<ToggleControl label={ __( 'Show the topic label on the photo', 'lc-bot2026' ) } checked={ showTerm !== false } onChange={ ( v ) => setAttributes( { showTerm: v } ) } />
			<SelectControl label={ __( 'Surface', 'lc-bot2026' ) } value={ surface } options={ [ { value: 'surface', label: 'Page (light)' }, { value: 'tint', label: 'Tint' }, { value: 'soft', label: 'Soft accent' }, { value: 'brand', label: 'Brand (dark)' } ] } onChange={ ( v ) => setAttributes( { surface: v } ) } />
			<div style={ { display: 'flex', gap: '12px' } }>
				<div style={ { flex: '1 1 0' } }><SelectControl label={ __( 'Space above', 'lc-bot2026' ) } value={ spaceTop || 'normal' } options={ [ { value: 'normal', label: __( 'Normal', 'lc-bot2026' ) }, { value: 'small', label: __( 'Small', 'lc-bot2026' ) }, { value: 'none', label: __( 'None', 'lc-bot2026' ) } ] } onChange={ ( v ) => setAttributes( { spaceTop: v } ) } /></div>
				<div style={ { flex: '1 1 0' } }><SelectControl label={ __( 'Space below', 'lc-bot2026' ) } value={ spaceBottom || 'normal' } options={ [ { value: 'normal', label: __( 'Normal', 'lc-bot2026' ) }, { value: 'small', label: __( 'Small', 'lc-bot2026' ) }, { value: 'none', label: __( 'None', 'lc-bot2026' ) } ] } help={ __( 'Trim the gap between neighbouring blocks that share a colour.', 'lc-bot2026' ) } onChange={ ( v ) => setAttributes( { spaceBottom: v } ) } /></div>
			</div>
			<ToggleControl label={ __( 'Brush edge at the top', 'lc-bot2026' ) } help={ __( 'Paints this block over the bottom of the one above.', 'lc-bot2026' ) } checked={ !! brushTop } onChange={ ( v ) => setAttributes( { brushTop: v } ) } />
		</EditorBlockShell>
	);
}
